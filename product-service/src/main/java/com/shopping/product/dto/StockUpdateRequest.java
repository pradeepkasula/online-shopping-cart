package com.shopping.product.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class StockUpdateRequest {
    
    @NotNull(message = "Stock quantity is required")
    @PositiveOrZero(message = "Stock must be positive or zero")
    private Integer stock;
    
    public StockUpdateRequest() {
    }
    
    public StockUpdateRequest(Integer stock) {
        this.stock = stock;
    }
    
    public Integer getStock() {
        return stock;
    }
    
    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
