'use client';

import { useEffect, useState } from 'react';
import { User } from '../types/types';

const UserTable = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                if (!res.ok) throw new Error('Failed to fetch users');
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p className="text-center">Cargando Usuarios...</p>;
    }

    return (
        <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">ID</th>
                    <th className="border border-gray-300 px-4 py-2">Usuario</th>
                    <th className="border border-gray-300 px-4 py-2">Correo</th>
                    <th className="border border-gray-300 px-4 py-2">Nombre Completo</th>
                    <th className="border border-gray-300 px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.usuario}</td>
                        <td className="border border-gray-300 px-4 py-2">{user.correo}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            {`${user.nombre} ${user.apell_paterno} ${user.apell_materno}`}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 space-x-2">
                            <button className="text-blue-500 hover:underline">
                                <i className="fas fa-pencil-alt"></i>
                            </button>
                            <button className="text-red-500 hover:underline">
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
