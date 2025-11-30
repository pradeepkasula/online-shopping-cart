package com.shopping.order.client;

import com.shopping.order.dto.ProductDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class ProductServiceClient {
    
    private static final Logger logger = LoggerFactory.getLogger(ProductServiceClient.class);
    
    private final RestTemplate restTemplate;
    private final String productServiceUrl;
    
    public ProductServiceClient(RestTemplate restTemplate,
                               @Value("${product.service.url}") String productServiceUrl) {
        this.restTemplate = restTemplate;
        this.productServiceUrl = productServiceUrl;
    }
    
    public ProductDto getProduct(Long productId) {
        try {
            String url = productServiceUrl + "/api/products/" + productId;
            return restTemplate.getForObject(url, ProductDto.class);
        } catch (Exception e) {
            logger.error("Error fetching product from Product Service: " + productId, e);
            return null;
        }
    }
    
    public boolean checkAvailability(Long productId, Integer quantity) {
        try {
            String url = productServiceUrl + "/api/products/" + productId + "/available?quantity=" + quantity;
            Boolean available = restTemplate.getForObject(url, Boolean.class);
            return available != null && available;
        } catch (Exception e) {
            logger.error("Error checking availability from Product Service: " + productId, e);
            return false;
        }
    }
    
    public void reduceStock(Long productId, Integer quantity) {
        try {
            ProductDto product = getProduct(productId);
            if (product == null) {
                throw new IllegalArgumentException("Product not found: " + productId);
            }
            
            int newStock = product.getStock() - quantity;
            if (newStock < 0) {
                throw new IllegalArgumentException("Insufficient stock for product: " + productId);
            }
            
            String url = productServiceUrl + "/api/products/" + productId + "/stock";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Integer> body = new HashMap<>();
            body.put("stock", newStock);
            
            HttpEntity<Map<String, Integer>> request = new HttpEntity<>(body, headers);
            
            restTemplate.exchange(url, HttpMethod.PUT, request, ProductDto.class);
            
            logger.info("Reduced stock for product {} by {}", productId, quantity);
        } catch (Exception e) {
            logger.error("Error reducing stock for product: " + productId, e);
            throw new RuntimeException("Failed to reduce stock", e);
        }
    }
}
