'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button, message } from 'antd';
import { login } from '@/utils/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push('/users');
    } catch (error) {
      console.error(error);
      message.error('Login fallido!');
    }
  };

  const goToSignUp = () => {
    router.push('/register');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 w-1/2">
        <div className="relative bg-white p-8 rounded-l shadow z-10">
          <h2 className="text-2xl font-semibold mb-4 text-black">Login</h2>
          <Input
            className="mb-4 text-black border-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input.Password
            className="mb-4 text-black border-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button block type="primary" onClick={handleLogin}>
            Login
          </Button>
          <div className="mt-4 text-center">
            <Button block type="default" onClick={goToSignUp}>
              Sign Up
            </Button>
          </div>
        </div>
        <img
          src="/pruebatecnicacover.jpg"
          alt="Cover"
          className="w-full h-full object-fill rounded-r"
        />
      </div>
    </div>
  );
}
