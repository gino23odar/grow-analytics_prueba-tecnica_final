import { User } from '../types/types';

const BASE_URL = 'http://localhost:3001/api'; // Base URL for the API

// Function to get the auth token from localStorage or sessionStorage
const getAuthToken = () => {
    return localStorage.getItem('authToken'); // Replace with your storage method
}

// Helper to include authorization in headers
const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    if (token) {
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    }
    return {}; // Return an empty object if no token
}

export async function getUsers() {
    const response = await fetch(`${BASE_URL}/users`, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch users');
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
            ...getAuthHeaders(), // Add authorization headers
        },
    });
    if (!response.ok) throw new Error('Failed to update user');
}
