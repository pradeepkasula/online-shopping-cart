package com.shopping.product.service;

import com.shopping.product.entity.Product;
import com.shopping.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    public Product createProduct(Product product) {
        if (product.getPrice().signum() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        if (product.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        return productRepository.save(product);
    }
    
    public Product updateStock(Long productId, Integer newStock) {
        if (newStock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
        
        product.setStock(newStock);
        return productRepository.save(product);
    }
    
    public boolean isStockAvailable(Long productId, Integer quantity) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            return false;
        }
        return productOpt.get().getStock() >= quantity;
    }
    
    public void reduceStock(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
        
        if (product.getStock() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for product: " + product.getName());
        }
        
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }
}
