package com.backend.login.logingadpalenque.repositories;

import com.backend.login.logingadpalenque.model.user.user;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<user, String> {

    // Método para buscar un usuario por email
    Optional<user> findByEmail(String email);

    // Método para verificar si un email existe
    boolean existsByEmail(String email);

    // Método para verificar si una contraseña existe
    boolean existsByContrasena(String contrasena);

    // Método para buscar un usuario por nombre
    Optional<user> findByNombre(String nombre);
}
