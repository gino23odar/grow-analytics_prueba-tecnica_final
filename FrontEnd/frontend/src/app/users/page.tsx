'use client';

import { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { getUsers, deleteUser } from '@/utils/api';
import { User } from '../../types/types';
import CreateUserForm from '@/components/CreateUserForm';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateUserModalVisible, setIsCreateUserModalVisible] = useState(false);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const usersData = await getUsers();
            setUsers(usersData);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch users!');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (id: number) => {
        router.push(`/users/${id}`);
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

    const handleUserCreated = () => {
        // Refresh the user list after creating a new user
        fetchUsers();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a: User, b: User) => a.id - b.id,
        },
        {
            title: 'User',
            dataIndex: 'usuario',
        },
        {
            title: 'Email',
            dataIndex: 'correo',
        },
        {
            title: 'Full Name',
            dataIndex: 'nombre_completo',
            render: (text: string, record: User) => (
                <span>{record.nombre} {record.apell_paterno} {record.apell_materno}</span>
            ),
        },
        {
            title: 'Actions',
            render: (text: string, record: User) => (
                <div>
                    <Button onClick={() => handleEdit(record.id)} className="mr-2" icon={<i className="fas fa-pencil-alt" />} />
                    <Button onClick={() => handleDelete(record.id)} icon={<i className="fas fa-trash" />} />
                </div>
            ),
        },
    ];

    return (
        <>
            <Button
                type="primary"
                onClick={() => setIsCreateUserModalVisible(true)}
                className="m-4"
            >
                Create New User
            </Button>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                className='mx-4'
            />
            <CreateUserForm
                visible={isCreateUserModalVisible}
                onClose={() => setIsCreateUserModalVisible(false)}
                onUserCreated={handleUserCreated}
            />
        </>
    );
}
