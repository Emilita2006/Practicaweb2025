package com.backend.permisos.permisosgadpalenque;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PermisosgadpalenqueApplication {

	public static void main(String[] args) {
		SpringApplication.run(PermisosgadpalenqueApplication.class, args);
	}

}
