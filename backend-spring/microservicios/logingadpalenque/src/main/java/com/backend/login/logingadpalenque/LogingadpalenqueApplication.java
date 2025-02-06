package com.backend.login.logingadpalenque;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class LogingadpalenqueApplication {

	public static void main(String[] args) {
		SpringApplication.run(LogingadpalenqueApplication.class, args);
	}

}
