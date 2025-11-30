package com.shopping.cart.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartResponse {
    private Long userId;
    private List<CartItemDto> items;
    private BigDecimal totalPrice;
    
    public CartResponse() {
    }
    
    public CartResponse(Long userId, List<CartItemDto> items, BigDecimal totalPrice) {
        this.userId = userId;
        this.items = items;
        this.totalPrice = totalPrice;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public List<CartItemDto> getItems() {
        return items;
    }
    
    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }
    
    public BigDecimal getTotalPrice() {
        return totalPrice;
    }
    
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
