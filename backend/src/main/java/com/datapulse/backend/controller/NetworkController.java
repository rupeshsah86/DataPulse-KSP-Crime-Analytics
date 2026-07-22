package com.datapulse.backend.controller;

import com.datapulse.backend.service.NetworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/network")
public class NetworkController {

    @Autowired
    private NetworkService networkService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getNetwork() {
        Map<String, Object> result = networkService.getNetworkData();
        return ResponseEntity.ok(result);
    }
}