import DefaultLayout from "@/layouts/default";
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { Calendar, Send, ChevronLeft } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card.jsx';
import { ReactNode } from 'react';

interface User {
  id: number;
  nombre: string;
}

interface PermisoData {
  empleado: string;
  tipoPermiso: string;
  fechaPermiso: string;
  fechaSalida: string;
  fechaRegreso: string;
  departamento: string;
  numeroHoras: number;
  tiempo: string;
}

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function IndexPage() {
  function CardContent({ children, className = '' }: CardProps) {
    return <div className={`${className}`}>{children}</div>;
  }
  
  function CardHeader({ children, className = '' }: CardProps) {
    return <div className={`border-b p-4 ${className}`}>{children}</div>;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [formData, setFormData] = useState<PermisoData>({
    empleado: '',
    tipoPermiso: '',
    fechaPermiso: '',
    fechaSalida: '',
    fechaRegreso: '',
    departamento: '',
    tiempo: '',
    numeroHoras: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8762/api/usuarios');
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user: User) =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!selectedUser) {
      alert('Por favor seleccione un empleado');
      return;
    }

    if (!formData.tipoPermiso || !formData.departamento) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/permisos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empleado: selectedUser.nombre,
          tipoPermiso: formData.tipoPermiso,
          fechaPermiso: formData.fechaPermiso,
          tiempo: formData.tiempo
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el permiso');
      }

      const result = await response.json();
      console.log('Permiso creado:', result);
      alert('Permiso creado exitosamente');
      
      // Limpiar el formulario después del envío exitoso
      setFormData({
        empleado: '',
        tipoPermiso: '',
        fechaPermiso: '',
        fechaSalida: '',
        fechaRegreso: '',
        departamento: '',
        numeroHoras: 0,
        tiempo: ''
      });
      setSelectedUser(null);
      setSearchTerm('');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el permiso. Por favor intente nuevamente.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (formData.fechaSalida && formData.fechaRegreso) {
      const salida = new Date(formData.fechaSalida);
      const regreso = new Date(formData.fechaRegreso);
  
      if (salida <= regreso) {
        const diferenciaDias = (regreso.getTime() - salida.getTime()) / (1000 * 60 * 60 * 24) + 1; // +1 para incluir el primer día
        const horasPorDia = 8; // Ajusta esto según tu horario laboral
        const totalHoras = diferenciaDias * horasPorDia;
  
        setFormData(prev => ({
          ...prev,
          numeroHoras: totalHoras
        }));
        setFormData(prev => ({
          ...prev,
          tiempo: diferenciaDias + ' días'
        }));
      } else {
        alert('La fecha de salida no puede ser mayor a la fecha de regreso.');
        setFormData(prev => ({
          ...prev,
          numeroHoras: 0
        }));
      }
    }
  }, [formData.fechaSalida, formData.fechaRegreso]);
  

  return (
    <DefaultLayout>
      <div className="max-w-5xl mx-auto bg-blue-50 min-h-screen p-4 lg:p-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <button className="flex items-center text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span className="ml-1">Volver al Dashboard</span>
            </button>
          </Link>
        </div>

        <Card className="bg-blue-100/50 border-2 border-blue-200 max-w-4xl mx-auto">
          <CardHeader className="bg-white/50 p-6">
            <CardTitle className="text-center text-2xl font-bold text-gray-800">
              COMPROBANTE DE PERMISO
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha Permiso
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="fechaPermiso"
                        value={formData.fechaPermiso}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <Calendar className="absolute right-5 top-4 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label className="block text-sm font-medium text-gray-700">
                      Seleccione su nombre:
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Buscar usuario..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {showDropdown && filteredUsers.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredUsers.map((user: User) => (
                          <div
                            key={user.id}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setSearchTerm(user.nombre);
                              setShowDropdown(false);
                            }}
                          >
                            {user.nombre}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Departamento:
                    </label>
                    <select
                      name="departamento"
                      value={formData.departamento}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione departamento</option>
                      <option value="Recursos Humanos">Recursos Humanos</option>
                      <option value="TIC">TIC</option>
                      <option value="Finanzas">Finanzas</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Día Salida
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="fechaSalida"
                          value={formData.fechaSalida}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <Calendar className="absolute right-5 top-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Día de Regreso
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="fechaRegreso"
                          value={formData.fechaRegreso}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <Calendar className="absolute right-5 top-4 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Número de Horas
                    </label>
                    <input
                      type="number"
                      name="numeroHoras"
                      value={formData.numeroHoras}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ingrese el número de horas"
                      required
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Razón:
                    </label>
                    <select 
                      name="tipoPermiso"
                      value={formData.tipoPermiso}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccione tipo de permiso</option>
                      <option value="Permiso Médico">Permiso Médico</option>
                      <option value="Permiso Personal">Permiso Personal</option>
                      <option value="Vacaciones">Vacaciones</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="border-t-2 border-gray-300 pt-2">
                    <p className="text-sm font-medium">Empleado</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-300 pt-2">
                    <p className="text-sm font-medium">Doctor</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t-2 border-gray-300 pt-2">
                    <p className="text-sm font-medium">G. Talento Humano</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <span>Enviar Permiso</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
             </form>  
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}