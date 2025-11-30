package com.shopping.product.config;

import com.shopping.product.entity.Product;
import com.shopping.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository) {
        return args -> {
            // Add sample products
            productRepository.save(new Product(
                    "Laptop",
                    "High-performance laptop with 16GB RAM and 512GB SSD",
                    new BigDecimal("999.99"),
                    10
            ));
            
            productRepository.save(new Product(
                    "Wireless Mouse",
                    "Ergonomic wireless mouse with precision tracking",
                    new BigDecimal("29.99"),
                    50
            ));
            
            productRepository.save(new Product(
                    "Mechanical Keyboard",
                    "RGB mechanical keyboard with blue switches",
                    new BigDecimal("89.99"),
                    25
            ));
            
            productRepository.save(new Product(
                    "USB-C Hub",
                    "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader",
                    new BigDecimal("39.99"),
                    30
            ));
            
            productRepository.save(new Product(
                    "Webcam",
                    "1080p HD webcam with built-in microphone",
                    new BigDecimal("59.99"),
                    15
            ));
            
            productRepository.save(new Product(
                    "Monitor",
                    "27-inch 4K UHD monitor with IPS panel",
                    new BigDecimal("399.99"),
                    8
            ));
            
            productRepository.save(new Product(
                    "Headphones",
                    "Noise-cancelling wireless headphones",
                    new BigDecimal("199.99"),
                    20
            ));
            
            productRepository.save(new Product(
                    "External SSD",
                    "1TB portable external SSD with USB 3.2",
                    new BigDecimal("129.99"),
                    12
            ));
            
            productRepository.save(new Product(
                    "Desk Lamp",
                    "LED desk lamp with adjustable brightness",
                    new BigDecimal("34.99"),
                    0  // Out of stock
            ));
            
            productRepository.save(new Product(
                    "Phone Stand",
                    "Adjustable phone stand for desk",
                    new BigDecimal("19.99"),
                    40
            ));
        };
    }
}
