import { User } from "../../lib/models/user.model";

export const fetchUserProfile = async (userId: string): Promise<Partial<User>> => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error fetching user profile');
    const data = await response.json();
    console.log("data from fetch looks like: ", data)
    return data.user;
};

export const updateUserProfile = async (name: string, email: string, userId: string) => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
    });
    if (!response.ok) throw new Error('Error updating profile');
    return response.json();
};

export const fetchUsers = async(): Promise<Partial<User>[]> =>{
    const response = await fetch('http://localhost:3000/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Error fetching users');
    const data = await response.json();
    return data.users;
}