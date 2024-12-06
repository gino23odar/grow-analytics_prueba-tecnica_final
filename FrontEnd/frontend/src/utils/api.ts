import { User } from '../types/types';


export async function getUsers() {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
}

export async function getUser(id: number) {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
}

export async function deleteUser(id: number) {
    const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
}

export async function updateUser(id: number, data: User) {
    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error('Failed to update user');
}
