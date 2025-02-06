package com.backend.permisos.permisosgadpalenque.repositories;

import com.backend.permisos.permisosgadpalenque.model.permisos.Permisos;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermisosRepository extends MongoRepository<Permisos, String> {

    // Método personalizado para buscar permisos por empleado
    List<Permisos> findByEmpleado(String empleado);
}
