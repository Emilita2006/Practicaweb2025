import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.trim()
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.contrasena) {
      setError('Por favor complete todos los campos');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingrese un correo electrónico válido');
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

    //logica para iniciar sesión...
    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Añade esto
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          contrasena: formData.contrasena
        })
      });

      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      const data = await response.json();
      
      // Si la autenticación es exitosa:
      // 1. Aquí podrías guardar el token en localStorage si el backend lo envía
      if (data.id) {
        localStorage.setItem('authToken', data.id);
       }
      
      // 2. Redirigir al usuario 
      router.push('/inicio'); 
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // El resto del componente permanece igual...
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
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
            TALENTO HUMANO
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-gray-700 text-center text-sm mb-6">
            Inicia sesión para continuar
          </h2>
          
          {error && 
             <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
             {error}
           </div>
          }

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex items-center justify-center w-full bg-blue-600 text-white mt-4 py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'CARGANDO...' : 'INGRESAR'}
            </button>
          </form>
          <div>
            <h3 className="text-center text-gray-700 text-sm">
              ¿No tienes una cuenta?{' '}
              <a
                href="/registro"
                className="text-blue-600 hover:underline">
                Regístrate
              </a>
            </h3>
          </div>
        </div>
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

export default LoginForm;