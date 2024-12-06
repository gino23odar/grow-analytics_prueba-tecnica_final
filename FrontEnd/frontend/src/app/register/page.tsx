'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, message, Select } from 'antd';
import { register } from '@/utils/auth'; // Add this utility function

export default function RegisterPage() {
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellPaterno, setApellPaterno] = useState('');
    const [apellMaterno, setApellMaterno] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('user'); // Default user type
    const router = useRouter();


    const rolId = tipoUsuario === 'admin' ? 1 : 2;

    const handleRegister = async () => {
        try {
          await register(usuario, correo, contrasena, rolId, nombre, apellPaterno, apellMaterno, tipoUsuario);
          message.success('Registro exitoso!');
          router.push('/login'); // Redirect to login after successful registration
        } catch (error) {
          console.error(error);
          message.error('Error al registrar!');
        }
      };

  const goToLogin = () => {
    router.push('/login'); // Redirects to the registration page
};

  return (
    <div className="flex justify-center items-center h-screen">
        <div className='grid grid-cols-1 md:grid-cols-2 w-1/2'>
            <img 
                src="/pruebatecnicacover.jpg" 
                alt="Cover" 
                className="w-full h-full object-fill rounded-l" 
            />
            <div className="relative w-96 bg-white p-8 rounded-r shadow z-10">
            <h2 className="text-2xl font-semibold mb-4 text-black">Registro</h2>
            <Input
            className="mb-4"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            />
            <Input
            className="mb-4"
            placeholder="Email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            />
            <Input.Password
            className="mb-4"
            placeholder="Password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            />
            <Input
            className="mb-4"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            />
            <Input
            className="mb-4"
            placeholder="Apellido Paterno"
            value={apellPaterno}
            onChange={(e) => setApellPaterno(e.target.value)}
            />
            <Input
            className="mb-4"
            placeholder="Apellido Materno"
            value={apellMaterno}
            onChange={(e) => setApellMaterno(e.target.value)}
            />
            <Select
            className="mb-4"
            placeholder="Select User Type"
            value={tipoUsuario}
            onChange={(value) => setTipoUsuario(value)} // Update the value based on selection
            >
            <Select.Option value="user">User</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            </Select>
            <Button block type="primary" onClick={handleRegister}>
            Sign Up
            </Button>
            <div className="mt-4 text-center">
            <Button block type="default" onClick={goToLogin}>
                Login
            </Button>
            </div>
        </div>
        </div>
    </div>
  );
}
