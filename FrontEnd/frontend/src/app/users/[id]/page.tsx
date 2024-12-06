'use client';

import { useState, useEffect } from 'react';
import { Input, Button, message } from 'antd';
import { useRouter } from 'next/navigation';
import { getUser, updateUser } from '../../../utils/api';
import { User, UserUpdateData } from '../../../types/types';

export default function UserDetailPage({ params }: { params: { id: string } }) {
    const [user, setUser] = useState<User>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(Number(params.id));
                setUser(userData);
                setName(userData.nombre_completo);
                setEmail(userData.correo);
            } catch (error) {
                console.error(error);
                message.error('Failed to fetch user!');
            }
        };

        fetchUser();
    }, [params.id]);

    const handleSave = async () => {
        try {
            const updateData: UserUpdateData = {
                nombre: name,
                apell_paterno: user!.apell_paterno, // Assuming you want to keep the existing last names
                apell_materno: user!.apell_materno,
                correo: email,
            };

            const updatedUser: User = {
                ...updateData,
                id: user!.id,
                usuario: user!.usuario,
                tipo_usuario: user!.tipo_usuario,
            };
            await updateUser(user!.id, updatedUser);
            message.success('User updated!');
            router.push('/users');
        } catch (error) {
            console.error(error);
            message.error('Failed to update user!');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="w-96 mx-auto p-8 bg-white shadow">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <Input
                className="mb-4"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                className="mb-4"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="primary" onClick={handleSave}>
                Save
            </Button>
            
        </div>
    );
}
