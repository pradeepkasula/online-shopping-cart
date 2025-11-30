package com.shopping.cart.client;

import com.shopping.cart.dto.ProductDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

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
}
