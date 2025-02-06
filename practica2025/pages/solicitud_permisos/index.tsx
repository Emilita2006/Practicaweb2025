import DefaultLayout from "@/layouts/default";
import Link from "next/link";
import { FileText, Printer, ChevronLeft } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { ReactNode, useEffect, useState } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface Permission {
  id: string;
  empleado: string;
  tipoPermiso: string;
  fechaPermiso: string;
  departamento: string | null;
  tiempo: string;
}

export default function IndexPage() {
  const [isClient, setIsClient] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    const empleado = localStorage.getItem('usuario');
    try {
      const response = await fetch(`http://localhost:8080/api/permisos/empleado/${empleado}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
      }
      const data = await response.json();
      setPermissions(data);
    } catch (err) {
      setError('Error loading permissions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  function CardContent({ children, className = '' }: CardProps) {
    return <div className={`${className}`}>{children}</div>;
  }
  
  function CardHeader({ children, className = '' }: CardProps) {
    return <div className={`border-b p-4 ${className} dark:border-gray-700`}>{children}</div>;
  }

  const handlePrintPDF = () => {
    const pdfUrl = '/resource/pdf-permiso.pdf';
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    document.body.appendChild(printFrame);
    printFrame.src = pdfUrl;
    
    printFrame.onload = () => {
      try {
        if(printFrame.contentWindow) {
          printFrame.contentWindow.print();
        } else {
          window.open(pdfUrl, '_blank');
        }
      } catch (error) {
        console.error('Error printing PDF:', error);
        window.open(pdfUrl, '_blank');
      } finally {
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }
    };
  };

  const formatPermissionType = (type: string) => {
    const types: { [key: string]: string } = {
      'vacation': 'Vacaciones',
      'sick': 'Permiso por Enfermedad',
      'personal': 'Permiso Personal'
    };
    return types[type] || type;
  };

  const PDFViewer = () => {
    if (!isClient) {
      return (
        <div className="w-full h-[600px] flex items-center justify-center dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Cargando visualizador de PDF...</p>
        </div>
      );
    }

    return (
      <div className="w-full h-[600px] dark:bg-gray-800">
        <iframe
          src="/resource/pdf-permiso.pdf#toolbar=0"
          className="w-full h-full border-none bg-white dark:bg-gray-800"
          title="PDF Viewer"
        >
          <div className="text-center py-4">
            <p className="dark:text-gray-300">No se puede mostrar el PDF directamente.</p>
            <Link 
              href="/resource/pdf-permiso.pdf" 
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Abrir PDF en nueva pestaña
            </Link>
          </div>
        </iframe>
      </div>
    );
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-lg">Cargando permisos...</p>
        </div>
      </DefaultLayout>
    );
  }

  

  return (
    <DefaultLayout>
      <div className="max-w-8xl mx-auto bg-gray-50 dark:bg-blue-800 min-h-screen p-4 lg:p-8">
        <div className="mb-8 flex items-center">
          <button className="flex items-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 px-4 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="ml-1 font-semibold">PERMISOS ACEPTADOS</span>
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="bg-white dark:bg-gray-800 p-6">
                <CardTitle className="text-xl font-semibold dark:text-white">Permisos Aprobados</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-sm text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left pb-4 font-semibold">Nombre del Empleado</th>
                        <th className="text-left pb-4 font-semibold">Tipo de Permiso</th>
                        <th className="text-left pb-4 font-semibold">Total del tiempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {error ? (

                        <tr className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-4 text-sm dark:text-gray-300" colSpan={3}>Lo sentimos, aún no tienes permisos que mostrar.</td>
                        </tr>
                      ) : (
                      permissions.map((permission) => (
                        <tr key={permission.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 text-sm dark:text-gray-300">{permission.empleado}</td>
                          <td className="py-4">
                            <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                              {formatPermissionType(permission.tipoPermiso)}
                            </span>
                          </td>
                          <td className="py-4 text-sm font-medium dark:text-gray-300">{permission.tiempo}</td>
                        </tr>
                      ))
                    )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Formulario de Permiso</h2>
              </div>
              <Card className="bg-white dark:bg-gray-800 p-6 dark:border-gray-700">
                <CardContent className="p-0">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                    <div className="flex flex-col items-center">
                      <PDFViewer />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Link href="/resource/pdf-permiso.pdf" target="_blank">
                      <button className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        <span className="hidden lg:inline">Ver Documento</span>
                      </button>
                    </Link>
                    <button 
                      onClick={handlePrintPDF} 
                      className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center"
                    >
                      <Printer className="w-5 h-5 mr-2" />
                      <span className="hidden lg:inline">Imprimir</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="mb-6 sticky top-8 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="bg-white dark:bg-gray-800">
                <CardTitle className="text-lg font-semibold dark:text-white">PERMISOS EN ESPERA</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Alert className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/50">
                  <AlertDescription className="text-yellow-800 dark:text-yellow-300 flex items-center justify-between">
                    <span>3 permisos en espera</span>
                    <Link href="/permisos_pendientes">
                      <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        Ver todos
                      </button>
                    </Link>
                  </AlertDescription>
                </Alert>
                
                <div className="mt-6 space-y-4 hidden lg:block">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Permisos este mes</p>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">12</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tasa de aprobación</p>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">85%</p>
                  </div>
                </div>
              </CardContent>

              <Card className="p-6 text-center bg-gradient-to-br from-blue-500 to-blue-600">
                <h2 className="text-xl font-semibold mb-4 text-white">Comprobante de permiso</h2>
                <Link href="/formulario">
                  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors w-full font-semibold">
                    Generar comprobante
                  </button>
                </Link>
              </Card>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}