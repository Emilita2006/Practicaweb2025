import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface RegistroFormData {
  nombre: string;
  email: string;
  contrasena: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefono: string;
  imagen?: File; // Cambiado de foto a imagen para consistencia
}

const RegistroForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistroFormData>({
    nombre: '',
    email: '',
    contrasena: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: '',
    imagen: undefined
  });
  const [confirmarContrasena, setConfirmarContrasena] = useState('');

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Tipos de documentos disponibles
  const tiposDocumento = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'PP', label: 'Pasaporte' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'telefono' || name === 'numeroDocumento' 
        ? value.replace(/\D/g, '') // Solo números
        : value.trim()
    }));
  };

  const validateForm = (): boolean => {
    // Validaciones comprehensivas
    if (Object.entries(formData).some(([key, value]) => 
      key !== 'imagen' && (value === '' || value === undefined)
    )) {
      setError('Por favor complete todos los campos');
      return false;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
      return false;
    }

    // Validación de contraseña
    if (formData.contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (formData.contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validación de teléfono (10 dígitos)
    if (!/^\d{10}$/.test(formData.telefono)) {
      setError('El número de teléfono debe tener 10 dígitos');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      
      // Añadir campos de texto
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('contrasena', formData.contrasena);
      formDataToSend.append('tipoDocumento', formData.tipoDocumento);
      formDataToSend.append('numeroDocumento', formData.numeroDocumento);
      formDataToSend.append('telefono', formData.telefono);

      // Añadir imagen si existe
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      const response = await fetch('http://localhost:8080/api/usuarios/registro', {
        method: 'POST',
        // No establecer Content-Type, dejarlo automático para FormData
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.text(); // Puede ser texto plano o JSON
        throw new Error(errorData || 'Error en el registro');
      }

      const data = await response.json();
      
      // Mostrar mensaje de éxito o redirigir
      alert('Registro exitoso. Por favor inicie sesión.');
      router.push('/');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        imagen: undefined
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="text-center mb-8">
          <div className="mt-2 flex justify-center">
            <img
              src="/resource/usuario.png"
              alt="Alcaldia Ciudadana de Palenque"
              className="h-24 w-auto"
            />
          </div>
          <h1 className="text-blue-600 text-2xl md:text-3xl font-bold">
            REGISTRO DE USUARIO
          </h1>
        </div>

        {error && 
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        }

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                NOMBRE COMPLETO
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombres"
                required
              />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              CORREO ELECTRÓNICO
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ejemplo@correoelectronico.com"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                TIPO DE DOCUMENTO
              </label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seleccione</option>
                {tiposDocumento.map(tipo => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                NÚMERO DE DOCUMENTO
              </label>
              <input
                id="numeroDocumento"
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Número de documento"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              TELÉFONO
            </label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="3001234567"
              required
            />
          </div>
          <div>
            <label htmlFor="foto" className="block text-sm font-medium text-gray-700 mb-1">
              FOTO DE PERFIL
            </label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
          />
          </div>
          <div>
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
              CONTRASEÑA
            </label>
            <input
              id="contrasena"
              type="password"
              name="contrasena"
              value={formData.contrasena}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••••"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmarContrasena" className="block text-sm font-medium text-gray-700 mb-1">
              CONFIRMAR CONTRASEÑA
            </label>
            <input
              id="confirmarContrasena"
              type="password"
              name="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(event) => setConfirmarContrasena(event.target.value)} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`inline-flex items-center justify-center w-full bg-blue-600 text-white mt-4 py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'REGISTRANDO...' : 'REGISTRARSE'}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <img
          src="/resource/palenque.png"
          alt="Alcaldia Ciudadana de Palenque"
          className="h-24 w-auto"
        />
      </div>
    </div>
  );
};

export default RegistroForm;