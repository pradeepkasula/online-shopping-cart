package com.shopping.cart.service;

import com.shopping.cart.client.ProductServiceClient;
import com.shopping.cart.dto.CartItemDto;
import com.shopping.cart.dto.CartResponse;
import com.shopping.cart.dto.ProductDto;
import com.shopping.cart.entity.CartItem;
import com.shopping.cart.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductServiceClient productServiceClient;
    
    public CartService(CartItemRepository cartItemRepository, ProductServiceClient productServiceClient) {
        this.cartItemRepository = cartItemRepository;
        this.productServiceClient = productServiceClient;
    }
    
    public CartItem addItem(Long userId, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        
        // Validate product exists and has sufficient stock
        ProductDto product = productServiceClient.getProduct(productId);
        if (product == null) {
            throw new IllegalArgumentException("Product not found: " + productId);
        }
        
        if (!productServiceClient.checkAvailability(productId, quantity)) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }
        
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository.findByUserIdAndProductId(userId, productId);
        
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            
            // Validate new quantity against stock
            if (!productServiceClient.checkAvailability(productId, newQuantity)) {
                throw new IllegalArgumentException("Insufficient stock for requested quantity");
            }
            
            item.setQuantity(newQuantity);
            return cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem(userId, productId, quantity);
            return cartItemRepository.save(newItem);
        }
    }
    
    public CartItem updateItem(Long itemId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + itemId));
        
        // Validate against stock
        if (!productServiceClient.checkAvailability(item.getProductId(), quantity)) {
            throw new IllegalArgumentException("Insufficient stock for requested quantity");
        }
        
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    
    public void removeItem(Long itemId) {
        if (!cartItemRepository.existsById(itemId)) {
            throw new IllegalArgumentException("Cart item not found: " + itemId);
        }
        cartItemRepository.deleteById(itemId);
    }
    
    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        
        List<CartItemDto> itemDtos = items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        BigDecimal totalPrice = itemDtos.stream()
                .map(CartItemDto::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return new CartResponse(userId, itemDtos, totalPrice);
    }
    
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }
    
    private CartItemDto convertToDto(CartItem item) {
        ProductDto product = productServiceClient.getProduct(item.getProductId());
        if (product == null) {
            // Handle case where product no longer exists
            return new CartItemDto(
                    item.getId(),
                    item.getProductId(),
                    "Product not available",
                    BigDecimal.ZERO,
                    item.getQuantity()
            );
        }
        
        return new CartItemDto(
                item.getId(),
                item.getProductId(),
                product.getName(),
                product.getPrice(),
                item.getQuantity()
        );
    }
}
