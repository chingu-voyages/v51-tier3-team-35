'use client'

import { fetchUserProfile, updateUserProfile } from "../../services/userService";
import { useState, useEffect, FormEvent } from "react";

import { User } from "../../../lib/models/user.model";
import { ErrorMessage, Field, Form, Formik } from "formik";

interface FormValues {
    name: string;
    password: string;
  }

export default function UserProfile({params}:{ params: { userId: string }}){
    const id = params.userId;
    console.log("id on user profile is: ", id);
    
    const [user, setUser] = useState<Partial<User>>({});
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() =>{
    fetchUserProfile(id)
    .then(setUser);
    console.log("User now looks like: ", user);
    },[])

    const initialFormValues: FormValues={
        name: user?.name || '',
        password: '',
      }

    if (!user) {
        return <div>Loading...</div>;
      }
    console.log("isEditing? ", isEditing);
    
      const handleSubmit = async (values: FormValues) => {
        await updateUserProfile(values.name, values.password, id);
      };
    
      return (
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-semibold mb-4">User Profile</h1>

          {!isEditing ? (
            <div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <p className="mt-1 text-gray-700">{user.name}</p>
            </div>
  
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <p className="mt-1 text-gray-700">{user.email}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Password</label>
              <p className="mt-1 text-gray-700">••••••••</p>
            </div>
  
            <button
              onClick={() => setIsEditing(true)} // Switch to edit mode
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit
            </button>
          </div>
          ):(
    
          <Formik
            initialValues={initialFormValues}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Name</label>
                  <Field
                    type="text"
                    name="name"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
    
                <div className="mb-4">
                  <label className="block text-sm font-medium">Email</label>
                  <p className="mt-1 text-gray-700">{user.email}</p>
                </div>
    
                <div className="mb-4">
                  <label className="block text-sm font-medium">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="mt-1 p-2 border border-gray-300 rounded w-full"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
    
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          )}
        </div>
      );
}