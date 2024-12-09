'use client'

import { useState, useEffect } from 'react';
import { Table, Button, message, Input, Modal, Pagination } from 'antd';
import { getUsers, deleteUser } from '@/utils/api';
import { User } from '../../types/types';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateUserForm from '@/components/CreateUserForm';
import EditUserForm from '@/components/EditUserForm';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateUserModalVisible, setIsCreateUserModalVisible] = useState(false);
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const fetchUsers = async (page: number = 1) => {
        try {
            const usersData = await getUsers(page, limit);
            console.log(usersData);

            if (Array.isArray(usersData.data)) {
                setUsers(usersData.data);
            } else if (typeof usersData.data === 'object') {
                setUsers(Object.values(usersData.data).map((user) => ({ ...(user as User), key: (user as User).id })));
            } else {
                message.error('Invalid data format!');
            }
            setTotalPages(usersData.totalPages);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch users!');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchUsers(page);
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleEdit = (user: User) => {
        setCurrentUser(user);
        setIsEditUserModalVisible(true);
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
        fetchUsers(currentPage);
    };

    const handleUserUpdated = () => {
        fetchUsers(currentPage);
        setIsEditUserModalVisible(false);
    };

    const filteredUsers = users.filter(user => {
        const fullName = `${user.nombre} ${user.apell_paterno} ${user.apell_materno}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a: User, b: User) => a.id - b.id,
            filters: users.map(user => ({ text: user.id.toString(), value: user.id })),
            onFilter: (value: number, record: User) => record.id === value,
        },
        {
            title: 'Usuario',
            dataIndex: 'usuario',
            sorter: (a: User, b: User) => a.usuario.localeCompare(b.usuario),
            filters: users.map(user => ({ text: user.usuario, value: user.usuario })),
            onFilter: (value: string, record: User) => record.usuario.includes(value),
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            sorter: (a: User, b: User) => a.correo.localeCompare(b.correo),
            filters: users.map(user => ({ text: user.correo, value: user.correo })),
            onFilter: (value: string, record: User) => record.correo.includes(value),
        },
        {
            title: 'Nombre Completo',
            dataIndex: 'nombre_completo',
            render: (text: string, record: User) => (
                <span>{record.nombre} {record.apell_paterno} {record.apell_materno}</span>
            ),
            sorter: (a: User, b: User) => {
                const fullNameA = `${a.nombre} ${a.apell_paterno} ${a.apell_materno}`;
                const fullNameB = `${b.nombre} ${b.apell_paterno} ${b.apell_materno}`;
                return fullNameA.localeCompare(fullNameB);
            },
        },
        {
            title: 'Acciones',
            render: (text: string, record: User) => (
                <div key={record.id}>
                    <Button
                        key={`edit-${record.id}`}
                        onClick={() => handleEdit(record)}
                        className="mr-2"
                        icon={<EditOutlined />}
                    />
                    <Button
                        key={`delete-${record.id}`}
                        onClick={() => handleDelete(record.id)}
                        icon={<DeleteOutlined />}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            <Input
                placeholder="Buscar por nombre completo"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="m-4"
            />
            <Button
                type="primary"
                onClick={() => setIsCreateUserModalVisible(true)}
                className="m-4"
            >
                Crear nuevo usuario
            </Button>
            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={false}
                className='mx-4'
            />
            <Pagination
                current={currentPage}
                total={totalPages * limit}
                pageSize={limit}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="m-4"
            />
            <CreateUserForm
                open={isCreateUserModalVisible}
                onClose={() => setIsCreateUserModalVisible(false)}
                onUserCreated={handleUserCreated}
            />
            <Modal
                title="Editar usuario"
                open={isEditUserModalVisible}
                onCancel={() => setIsEditUserModalVisible(false)}
                footer={null}
            >
                {currentUser && (
                    <EditUserForm
                        user={currentUser}
                        onUserUpdated={handleUserUpdated}
                    />
                )}
            </Modal>
        </>
    );
}