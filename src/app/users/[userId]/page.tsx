'use client'

import { fetchUserProfile, updateUserProfile } from "../../services/userService";
import { useState, useEffect, FormEvent } from "react";

import { User } from "../../../lib/models/user.model";



export default function UserProfile({params}:{ params: { userId: string }}){
    const id = params.userId;
    console.log("id on user profile is: ", id);
    const initialFormData = {
        _id: id,
        name: '',
        email: '',
        password: '',
      };

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [user, setUser] = useState<Partial<User>>({});
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({...initialFormData})

    useEffect(() =>{
    fetchUserProfile(id)
    .then(setUser);
    console.log("User now looks like: ", user);
    setIsLoading(false);
    },[])


    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      };

      const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateUserProfile(formData.name, formData.email, formData._id)
        setFormData({ ...formData });

      };

  if(isLoading){
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        {isEditingName ? (
          <input
            type="text"
            value={user.name}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        ) : (
          <p className="mt-1 text-gray-700">{user.name}</p>
        )}
        <button
          onClick={() => setIsEditingName(!isEditingName)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditingName ? 'Save' : 'Edit Name'}
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <p className="mt-1 text-gray-700">{user.email }</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Password</label>
        {isEditingPassword ? (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        ) : (
          <p className="mt-1 text-gray-700">••••••••</p>
        )}
        <button
          onClick={() => setIsEditingPassword(!isEditingPassword)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditingPassword ? 'Save' : 'Edit Password'}
        </button>
      </div>
    </div>
  );
}