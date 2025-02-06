package com.backend.permisos.permisosgadpalenque.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.permisos.permisosgadpalenque.model.permisos.Permisos;
import com.backend.permisos.permisosgadpalenque.repositories.PermisosRepository;

@Service
public class PermisosServices {
    @Autowired
    private PermisosRepository userRepository;

    public Permisos findById(String id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

}