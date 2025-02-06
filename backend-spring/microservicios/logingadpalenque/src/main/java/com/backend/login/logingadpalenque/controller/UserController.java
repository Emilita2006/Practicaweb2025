package com.backend.login.logingadpalenque.controller;

import com.backend.login.logingadpalenque.model.user.user;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.backend.login.logingadpalenque.repositories.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping
@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Crear un nuevo usuario
    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(
            @RequestParam("email") String email,
            @RequestParam("nombre") String nombre,
            @RequestParam("contrasena") String contrasena,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {

        // Verificar si el email ya existe
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("El correo electrónico ya está registrado");
        }

        try {
            // Crear un nuevo usuario
            user nuevoUsuario = new user();
            nuevoUsuario.setEmail(email);
            nuevoUsuario.setNombre(nombre);
            nuevoUsuario.setContrasena(contrasena);

            // Manejar la imagen si se proporciona
            if (imagen != null && !imagen.isEmpty()) {
                // Generar un nombre de archivo único
                String nombreArchivo = UUID.randomUUID().toString() + "_" +
                        imagen.getOriginalFilename();

                // Definir la ruta de almacenamiento
                Path rutaAlmacenamiento = Paths.get("public/uploads/usuarios")
                        .resolve(nombreArchivo)
                        .toAbsolutePath();

                // Crear directorios si no existen
                Files.createDirectories(rutaAlmacenamiento.getParent());

                // Copiar la imagen
                Files.copy(imagen.getInputStream(), rutaAlmacenamiento,
                        StandardCopyOption.REPLACE_EXISTING);

                // Guardar la ruta de la imagen en el usuario
                nuevoUsuario.setFoto("/uploads/usuarios" + "/" + nombreArchivo);
            }

            // Guardar el nuevo usuario
            user usuarioGuardado = userRepository.save(nuevoUsuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(usuarioGuardado);

        } catch (IOException e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar la imagen: " + e.getMessage());
        }
    }

    // Iniciar sesión
    @PostMapping("/login")
    public ResponseEntity<?> loginUsuario(@RequestBody user loginRequest) {
        // Buscar usuario por email
        user usuario = userRepository.findByEmail(loginRequest.getEmail())
                .orElse(null);

        // Verificar si el usuario existe y la contraseña coincide
        if (usuario == null || !usuario.getContrasena().equals(loginRequest.getContrasena())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Email o contraseña incorrectos");
        }

        // Si todo está bien, devolver el usuario
        return ResponseEntity.ok(usuario);
    }

    // Obtener todos los usuarios
    @GetMapping
    public List<user> obtenerTodosLosUsuarios() {
        return userRepository.findAll();
    }

    // Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable String id) {
        Optional<user> usuario = userRepository.findById(id);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    // Actualizar usuario
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable String id, @RequestBody user detallesUsuario) {
        Optional<user> usuarioOptional = userRepository.findById(id);

        if (usuarioOptional.isPresent()) {
            user usuarioExistente = usuarioOptional.get();

            // Actualizar campos
            usuarioExistente.setNombre(detallesUsuario.getNombre());
            usuarioExistente.setEmail(detallesUsuario.getEmail());
            usuarioExistente.setFoto(detallesUsuario.getFoto());

            // NOTA: No actualizar contraseña aquí por seguridad
            user usuarioActualizado = userRepository.save(usuarioExistente);
            return ResponseEntity.ok(usuarioActualizado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    // Eliminar usuario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable String id) {
        return userRepository.findById(id)
                .map(usuario -> {
                    userRepository.deleteById(id);
                    return ResponseEntity.ok("Usuario eliminado exitosamente");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado"));
    }

    // Buscar usuario por email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> buscarPorEmail(@PathVariable String email) {
        Optional<user> usuario = userRepository.findByEmail(email);

        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }
}