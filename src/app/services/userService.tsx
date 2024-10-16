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

export const updateUserProfile = async (name: string, password: string, userId: string) => {
    
    if(password.length > 0){
    const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
    });
    if (!response.ok) throw new Error('Error updating profile');
    return response.json();
    } else {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        if (!response.ok) throw new Error('Error updating profile');
        return response.json(); 
    }
};

export const getUserByEmail = async (email: string) => {
    const response = await fetch(`http://localhost:3000/api/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Error fetching user by email');
    const data = await response.json();
    return data.user;
}