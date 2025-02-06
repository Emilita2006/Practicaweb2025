import DefaultLayout from "@/layouts/default";
import { Button } from "@nextui-org/button";
import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";
import { MdOutlinePermIdentity } from "react-icons/md";
import Link from "next/link";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-2xl font-bold mb-8">Departamento de Talento Humano</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <p className="text-tiny uppercase font-bold">Gestion de Recursos Humanos</p>
              <small className="text-default-500">Solicitar su Permiso</small>
              <h4 className="font-bold text-large mb-4">Aqui</h4>
              <Link href="/dashboard">
                <Button
                  color="success"
                  startContent={<MdOutlinePermIdentity />}
                  className="text-white w-full sm:w-auto"
                >
                  Permisos
                </Button>
              </Link>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <div className="relative w-full aspect-video">
                <Image
                    alt="Card background"
                    className="object-cover rounded-xl"
                    height={350}
                    src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    width={550}
                />
              </div>
            </CardBody>
          </Card>
          
          {/* You can add more cards or content here for the desktop view */}
          <Card className="py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            <CardBody className="flex flex-col justify-center items-center text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Bienvenido al Portal de Recursos Humanos</h2>
              <p className="mb-4">Gestione sus permisos y solicitudes de manera eficiente</p>
              <p className="text-sm opacity-80">Acceda a todos los servicios disponibles para empleados</p>
            </CardBody>
          </Card>
        </div>
      </div>

    </DefaultLayout>
  );
}