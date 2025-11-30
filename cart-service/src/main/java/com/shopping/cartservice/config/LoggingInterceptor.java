package com.shopping.cartservice.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class LoggingInterceptor implements HandlerInterceptor {
    private static final Logger logger = LogManager.getLogger(LoggingInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        long startTime = System.currentTimeMillis();
        request.setAttribute("startTime", startTime);
        
        logger.info("API Request - Method: {}, URI: {}, Query: {}, Remote IP: {}", 
            request.getMethod(), 
            request.getRequestURI(), 
            request.getQueryString() != null ? request.getQueryString() : "N/A",
            request.getRemoteAddr());
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        long startTime = (Long) request.getAttribute("startTime");
        long endTime = System.currentTimeMillis();
        long executeTime = endTime - startTime;
        
        logger.info("API Response - Method: {}, URI: {}, Status: {}, Time: {}ms", 
            request.getMethod(), 
            request.getRequestURI(), 
            response.getStatus(),
            executeTime);
        
        if (ex != null) {
            logger.error("API Error - Method: {}, URI: {}, Error: {}", 
                request.getMethod(), 
                request.getRequestURI(), 
                ex.getMessage(), ex);
        }
    }
}
