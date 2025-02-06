package com.backend.permisos.permisosgadpalenque.controller;

import com.backend.permisos.permisosgadpalenque.model.permisos.Permisos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.permisos.permisosgadpalenque.repositories.PermisosRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class PermisosController {

    @Autowired
    private PermisosRepository permisosRepository;

    // Crear un nuevo permiso
    @PostMapping("/crear")
    public ResponseEntity<?> crearPermiso(@RequestBody Permisos permiso) {
        try {
            Permisos nuevoPermiso = permisosRepository.save(permiso);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPermiso);
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al crear el permiso: " + e.getMessage());
        }
    }

    // Obtener todos los permisos
    @GetMapping
    public List<Permisos> obtenerTodosLosPermisos() {
        return permisosRepository.findAll();
    }

    // Obtener permiso por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPermisoPorId(@PathVariable String id) {
        Optional<Permisos> permiso = permisosRepository.findById(id);

        if (permiso.isPresent()) {
            return ResponseEntity.ok(permiso.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permiso no encontrado");
        }
    }

    // Buscar permisos por empleado
    @GetMapping("/empleado/{empleado}")
    public ResponseEntity<?> buscarPermisosPorEmpleado(@PathVariable String empleado) {
        List<Permisos> permisos = permisosRepository.findByEmpleado(empleado);

        if (!permisos.isEmpty()) {
            return ResponseEntity.ok(permisos);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No se encontraron permisos para este empleado");
        }
    }

    // Actualizar permiso
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarPermiso(@PathVariable String id, @RequestBody Permisos detallesPermiso) {
        Optional<Permisos> permisoOptional = permisosRepository.findById(id);

        if (permisoOptional.isPresent()) {
            Permisos permisoExistente = permisoOptional.get();

            // Actualizar campos
            permisoExistente.setEmpleado(detallesPermiso.getEmpleado());
            permisoExistente.setTipoPermiso(detallesPermiso.getTipoPermiso());
            permisoExistente.setFechaPermiso(detallesPermiso.getFechaPermiso());
            permisoExistente.setDepartamento(detallesPermiso.getDepartamento());
            permisoExistente.setTiempo(detallesPermiso.getTiempo());

            Permisos permisoActualizado = permisosRepository.save(permisoExistente);
            return ResponseEntity.ok(permisoActualizado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permiso no encontrado");
        }
    }

    // Eliminar permiso
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPermiso(@PathVariable String id) {
        return permisosRepository.findById(id)
                .map(permiso -> {
                    permisosRepository.deleteById(id);
                    return ResponseEntity.ok("Permiso eliminado exitosamente");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Permiso no encontrado"));
    }
}