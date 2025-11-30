package com.shopping.product.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SwaggerRedirectController {
    @GetMapping("/swagger")
    public String redirectToSwaggerUi() {
        return "redirect:/swagger-ui/index.html";
    }
}
