import { User } from '../types/types';

const BASE_URL = 'http://localhost:3001/api'; // Base URL for the API

export async function getUsers() {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
}

export async function getUser(id: number) {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
}

export async function deleteUser(id: number) {
    const response = await fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete user');
}

export async function updateUser(id: number, data: User) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) throw new Error('Failed to update user');
}
