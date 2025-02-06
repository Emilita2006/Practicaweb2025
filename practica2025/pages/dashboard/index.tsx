import DefaultLayout from "@/layouts/default";
import Link from "next/link";
import { PieChart, Pie, Cell } from 'recharts';
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [isClient, setIsClient] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [imagen, setImagen] = useState('');
  
  const data = [
    { id: 1, name: 'Trabajado', value: 40 },
    { id: 2, name: 'Por trabajar', value: 60 },
  ];

  const userInfo = async () =>{
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${authToken}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching user data usuario');
      }

      const data = await response.json();
      if (data) {
        localStorage.setItem('usuario', data.nombre);
       }
      setNombre(data.nombre);
      setEmail(data.email);
      setImagen('http://localhost:8080/'+data.foto);
      
      
      
    } catch (err) {
    } finally {
    }
  }
  
  const COLORS = ['#2563eb', '#67e8f9'];

  useEffect(() => {
    setIsClient(true);
    userInfo();
  }, []);

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto bg-white min-h-screen p-4 lg:p-8">
        {/* Profile Header - Made more prominent for desktop */}
        <div className="flex items-center gap-4 mb-8 bg-white-700 rounded-lg p-6 shadow-sm">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-400 overflow-hidden">
            {isClient && (
              <img
                src={imagen}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900"> {nombre} </h1>
            <p className="text-sm lg:text-base text-gray-500">{email}</p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {/* Stats Cards - Expanded for desktop */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <Clock className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-blue-600" />
                  <p className="text-sm lg:text-base text-gray-600">Días Laborados</p>
                  <p className="text-xl lg:text-2xl font-semibold text-blue-600 mt-2">15</p>
                </CardContent>
              </Card>
              <Card className="p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <Calendar className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-blue-600" />
                  <p className="text-sm lg:text-base text-gray-600">Faltas Laborales</p>
                  <p className="text-xl lg:text-2xl font-semibold text-blue-600 mt-2">2</p>
                </CardContent>
              </Card>
              <Card className="p-4 lg:p-6 text-center hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-blue-600" />
                  <p className="text-sm lg:text-base text-gray-600">Cumplimiento del mes</p>
                  <p className="text-xl lg:text-2xl font-semibold text-blue-600 mt-2">90%</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Files Section - Enhanced for desktop */}
            <div className="mb-6">
              <h2 className="text-xl lg:text-2xl font-semibold mb-4">Últimos Archivos</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card className="p-4 lg:p-6 bg-blue-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {isClient && (
                      <img
                        src="/resource/Permisos-de-trabajo.jpg"
                        alt="Permiso"
                        className="w-full h-32 lg:h-40 object-cover rounded mb-3"
                      />
                    )}
                    <p className="text-sm lg:text-base text-center text-gray-600">Permisos solicitados</p>
                  </CardContent>
                </Card>
                <Card className="p-4 lg:p-6 bg-blue-50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {isClient && (
                      <img
                        src="/resource/espera.png"
                        alt="Reporte"
                        className="w-full h-32 lg:h-40 object-cover rounded mb-3"
                      />
                    )}
                    <p className="text-sm lg:text-base text-center text-gray-600">Permisos en espera</p>
                  </CardContent>
                </Card>
                <Card className="p-4 lg:p-6 bg-blue-50 hover:shadow-lg transition-shadow hidden lg:block">
                  <CardContent className="p-0">
                    {isClient && (
                      <img
                        src="/resource/historial.jpg"
                        alt="Historico"
                        className="w-full h-32 lg:h-40 object-cover rounded mb-3"
                      />
                    )}
                    <p className="text-sm lg:text-base text-center text-gray-600">Historial de permisos</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            {/* Pie Chart - Enlarged for desktop */}
            {isClient && (
              <Card className="p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Progreso Mensual</h3>
                <PieChart width={280} height={200} className="mx-auto">
                  <Pie
                    data={data}
                    cx={140}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex justify-center gap-4 mt-4">
                  {data.map((entry, index) => (
                    <div key={entry.id} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm text-gray-600">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Biometric System - Enhanced for desktop */}
            <Card className="p-6 text-center bg-gradient-to-br from-blue-500 to-blue-600">
              <h2 className="text-xl font-semibold mb-4 text-white">Sistema biométrico</h2>
              <Link href="/solicitud_permisos">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors w-full font-semibold">
                  Ingresar Permisos
                </button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}