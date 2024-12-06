'use client';

import { useEffect, useState } from 'react';
import { Table, Button, message, Input} from 'antd';
import { getAdminUsers, updateUser, deleteUser } from '@/utils/api';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '../../types/types';

const AdminUserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableUserId, setEditableUserId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const usersData = await getAdminUsers();
      console.log(usersData)
      if (Array.isArray(usersData.data)) {
        setUsers(usersData.data);
      } else if (typeof usersData.data === 'object') {
        setUsers(Object.values(usersData.data).map((user) => ({ ...(user as User), key: (user as User).id })));
      } else {
        message.error('Formato de data invalido!');
      }
    } catch (error) {
      console.error(error);
      message.error('Fallo el intento de visualizar usuario!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = async (user: User) => {
    try {
      await updateUser(user.id, user);
      message.success('Usuario actualizado exitosamente!');
      setEditableUserId(null); 
    } catch (error) {
      console.error(error);
      message.error('No se pudo actualizar el usuario!');
    }
  };

  const handleDelete = async (id: number) => {
    try {
        await deleteUser(id);
        message.success('User deleted!');
        setUsers(users.filter(user => user.id !== id));
    } catch (error) {
        console.error(error);
        message.error('Failed to delete user!');
    }
  };

  if (loading) {
    return <p className="text-center">Cargando Usuarios...</p>;
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      render: (text: string, record: User) => (
        <Input
          value={editableUserId === record.id ? record.usuario : text}
          onChange={(e) => {
            const updatedUser = { ...record, usuario: e.target.value };
            setUsers(users.map(user => (user.id === record.id ? updatedUser : user)));
          }}
          disabled={editableUserId !== record.id} // Disable input if not editing
        />
      ),
    },
    {
      title: 'Tipo de Usuario',
      dataIndex: 'tipo_usuario',
      render: (text: string, record: User) => (
        <Input
          value={editableUserId === record.id ? record.tipo_usuario : text}
          onChange={(e) => {
            const updatedUser = { ...record, tipo_usuario: e.target.value };
            setUsers(users.map(user => (user.id === record.id ? updatedUser : user)));
          }}
          disabled={editableUserId !== record.id} // Disable input if not editing
        />
      ),
    },
    {
      title: 'Acciones',
      render: (text: string, record: User) => (
        <div>
          {editableUserId === record.id ? (
            <Button onClick={() => handleEdit(record)}>Guardar</Button>
          ) : (
            <Button onClick={() => setEditableUserId(record.id)} icon={<EditOutlined />}>Editar</Button>
          )}
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      className='m-4'
    />
  );
};

export default AdminUserTable; 