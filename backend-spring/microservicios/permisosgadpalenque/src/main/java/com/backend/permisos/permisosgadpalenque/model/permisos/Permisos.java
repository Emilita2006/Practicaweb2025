package com.backend.permisos.permisosgadpalenque.model.permisos;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "permisos")
public class Permisos {

    @Id
    private String id;

    private String empleado;
    private String tipoPermiso;
    private String fechaPermiso;
    private String departamento;
    private String tiempo;

    // Constructor vacío
    public Permisos() {
    }

    // Constructor con todos los campos
    public Permisos(String empleado, String tipoPermiso, String departamento, String tiempo, String fechaPermiso) {
        this.empleado = empleado;
        this.tipoPermiso = tipoPermiso;
        this.fechaPermiso = fechaPermiso;

        this.departamento = departamento;
        this.tiempo = tiempo;
    }

    // Getters y setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmpleado() {
        return empleado;
    }

    public void setEmpleado(String empleado) {
        this.empleado = empleado;
    }

    public String getTipoPermiso() {
        return tipoPermiso;
    }

    public void setTipoPermiso(String tipoPermiso) {
        this.tipoPermiso = tipoPermiso;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getTiempo() {
        return tiempo;
    }

    public void setTiempo(String tiempo) {
        this.tiempo = tiempo;
    }

    public String getFechaPermiso() {
        return fechaPermiso;
    }

    public void setFechaPermiso(String fechaPermiso) {
        this.fechaPermiso = fechaPermiso;
    }

    // Método toString para facilitar la depuración
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", empleado='" + empleado + '\'' +
                ", tipoPermiso='" + tipoPermiso + '\'' +
                ", tiempo='" + tiempo + '\'' +
                ", fechaPermiso='" + fechaPermiso + '\'' +
                ", departamento='" + departamento + '\'' +
                '}';
    }
}