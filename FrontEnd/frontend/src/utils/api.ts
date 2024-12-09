import { User, AdminUser } from '../types/types';

const BASE_URL = 'http://localhost:3001/api';


const getAuthToken = () => {
    return localStorage.getItem('authToken');
}


const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    if (token) {
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    }
    return {};
}

export async function getUsers(page: number = 1, limit: number = 10) {
    const response = await fetch(`${BASE_URL}/users?page=${page}&limit=${limit}`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
}

export async function getUser(id: number) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
}

export async function deleteUser(id: number) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete user');
}

export async function updateUser(id: number, data: User) {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
    });
    if (!response.ok) throw new Error('Failed to update user');
}

export async function getAdminUsers(page: number = 1, limit: number = 10): Promise<{ data: AdminUser[] }> {
    const response = await fetch(`${BASE_URL}/admin/users?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch admin users');
    }

    const data = await response.json();
    return { data: data };
}
