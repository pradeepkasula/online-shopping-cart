package com.shopping.order.service;

import com.shopping.order.client.ProductServiceClient;
import com.shopping.order.dto.CreateOrderRequest;
import com.shopping.order.dto.OrderItemRequest;
import com.shopping.order.dto.ProductDto;
import com.shopping.order.entity.Order;
import com.shopping.order.entity.OrderItem;
import com.shopping.order.entity.OrderStatus;
import com.shopping.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderService {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);
    
    private final OrderRepository orderRepository;
    private final ProductServiceClient productServiceClient;
    
    public OrderService(OrderRepository orderRepository, ProductServiceClient productServiceClient) {
        this.orderRepository = orderRepository;
        this.productServiceClient = productServiceClient;
    }
    
    public Order createOrder(CreateOrderRequest request) {
        // Validate all products and check availability
        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductDto product = productServiceClient.getProduct(itemRequest.getProductId());
            if (product == null) {
                throw new IllegalArgumentException("Product not found: " + itemRequest.getProductId());
            }
            
            if (!productServiceClient.checkAvailability(itemRequest.getProductId(), itemRequest.getQuantity())) {
                throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
            }
        }
        
        // Create order with PENDING status
        Order order = new Order();
        order.setUserId(request.getUserId());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        
        // Add order items
        for (OrderItemRequest itemRequest : request.getItems()) {
            ProductDto product = productServiceClient.getProduct(itemRequest.getProductId());
            
            OrderItem orderItem = new OrderItem(
                    itemRequest.getProductId(),
                    itemRequest.getQuantity(),
                    product.getPrice()
            );
            
            order.addItem(orderItem);
            
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }
        
        order.setTotalAmount(totalAmount);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        try {
            // Reduce stock for all products
            for (OrderItemRequest itemRequest : request.getItems()) {
                productServiceClient.reduceStock(itemRequest.getProductId(), itemRequest.getQuantity());
            }
            
            // Update order status to CONFIRMED
            savedOrder.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(savedOrder);
            
            logger.info("Order created successfully: {}", savedOrder.getId());
            
        } catch (Exception e) {
            logger.error("Failed to reduce stock, marking order as FAILED", e);
            savedOrder.setStatus(OrderStatus.FAILED);
            orderRepository.save(savedOrder);
            throw new RuntimeException("Order creation failed: " + e.getMessage(), e);
        }
        
        return savedOrder;
    }
    
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
    
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
