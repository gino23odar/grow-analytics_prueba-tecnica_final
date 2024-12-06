'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getUser, updateUser } from '@/utils/api';
import { User } from '@/types/types';
import { message } from 'antd';

const UserDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(Number(id));
        setUser(userData);
      } catch (error) {
        console.error(error);
        message.error('Error al obtener los detalles del usuario.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleChange = (value: string, field: string) => {
    if (user) {
      setUser({ ...user, [field]: value });
    }
  };

  const handleSave = async () => {
    if (user) {
      try {
        await updateUser(user.id, user);
        message.success('Usuario actualizado exitosamente!');
        router.push('/admin'); // Redirigir a la tabla de administración
      } catch (error) {
        console.error(error);
        message.error('Error al actualizar el usuario.');
      }
    }
  };

  if (loading) {
    return <p>Cargando detalles del usuario...</p>;
  }

  if (!user) {
    return <p>Usuario no encontrado.</p>;
  }

  return (
    <div>
      <h2>Editar Usuario: {user.usuario}</h2>
      <input
        value={user.usuario}
        onChange={(e) => handleChange(e.target.value, 'usuario')}
        placeholder="Usuario"
      />
      <input
        value={user.tipo_usuario}
        onChange={(e) => handleChange(e.target.value, 'tipo_usuario')}
        placeholder="Tipo de Usuario"
      />
      <button onClick={handleSave}>Guardar</button>
    </div>
  );
};

export default UserDetailPage; 