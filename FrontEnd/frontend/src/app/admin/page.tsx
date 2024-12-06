'use client';

import { useEffect, useState } from 'react';
import { Table, Button, message, Input} from 'antd';
import { getAdminUsers, updateUser, deleteUser } from '@/utils/api';
import { EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { User } from '../../types/types';
import { getAuthToken } from '@/utils/auth';

const AdminUserTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableUserId, setEditableUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<{ [key: string]: string }>({
    id: '',
    usuario: '',
    tipo_usuario: '',
  });

  const fetchUsers = async () => {
    try {
      const usersData = await getAdminUsers();
      console.log(usersData)
      if (Array.isArray(usersData.data)) {
        setUsers(usersData.data);
        setFilteredUsers(usersData.data);
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
    
    const token = getAuthToken();
    if (token) {
      // Decodifica el token para verificar el rol del usuario
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.rol === 'admin') {
        setIsAdmin(true);
      } else {
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
            router.push('/login'); // Redirige a login después de ocultar el popup
          }, 3000);
      }
    } else {
      message.error('No estás autenticado.');
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filtrar usuarios cada vez que cambian los valores de búsqueda
    const filtered = users.filter(user => {
      return (
        user.id.toString().includes(searchValues.id) &&
        user.usuario.toLowerCase().includes(searchValues.usuario.toLowerCase()) &&
        user.tipo_usuario.toLowerCase().includes(searchValues.tipo_usuario.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  }, [searchValues, users]);

  const handleSearchChange = (field: string, value: string) => {
    setSearchValues({ ...searchValues, [field]: value });
  };

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
      title: (
        <div>
          ID
          <Button icon={<SearchOutlined />} onClick={() => {}} />
          <Input
            placeholder="Buscar ID"
            value={searchValues.id}
            onChange={(e) => handleSearchChange('id', e.target.value)}
            style={{ width: 100, marginLeft: 8 }}
          />
        </div>
      ),
      dataIndex: 'id',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: (
        <div>
          Usuario
          <Button icon={<SearchOutlined />} onClick={() => {}} />
          <Input
            placeholder="Buscar Usuario"
            value={searchValues.usuario}
            onChange={(e) => handleSearchChange('usuario', e.target.value)}
            style={{ width: 100, marginLeft: 8 }}
          />
        </div>
      ),
      dataIndex: 'usuario',
      render: (text: string, record: User) => (
        <Input
          value={editableUserId === record.id ? record.usuario : text}
          onChange={(e) => {
            const updatedUser = { ...record, usuario: e.target.value };
            setUsers(users.map(user => (user.id === record.id ? updatedUser : user)));
          }}
          disabled={editableUserId !== record.id}
        />
      ),
    },
    {
      title: (
        <div>
          Tipo de Usuario
          <Button icon={<SearchOutlined />} onClick={() => {}} />
          <Input
            placeholder="Buscar Tipo"
            value={searchValues.tipo_usuario}
            onChange={(e) => handleSearchChange('tipo_usuario', e.target.value)}
            style={{ width: 100, marginLeft: 8 }}
          />
        </div>
      ),
      dataIndex: 'tipo_usuario',
      render: (text: string, record: User) => (
        <Input
          value={editableUserId === record.id ? record.tipo_usuario : text}
          onChange={(e) => {
            const updatedUser = { ...record, tipo_usuario: e.target.value };
            setUsers(users.map(user => (user.id === record.id ? updatedUser : user)));
          }}
          disabled={editableUserId !== record.id}
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
    <>
        {showPopup && <div className='bg-red-600 w-full text-2xl justify-center items-center'>No estas autorizado para ver esta tabla</div>}
        <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className='m-4'
        />
    </>
  );
};

export default AdminUserTable; 