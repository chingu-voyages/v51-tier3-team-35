"use client";

import { useEffect, useState } from "react";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../services/userService";

import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { User } from "../../../lib/models/user.model";

interface FormValues {
  name: string;
  password: string;
}

export default function UserProfile({
  params,
}: {
  params: { userId: string };
}) {
  const id = params.userId;

  const [user, setUser] = useState<Partial<User>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile(id).then(setUser);
  }, []);

  const initialFormValues: FormValues = {
    name: user?.name || "",
    password: "",
  };

  const validate = (values: FormValues) => {
    const errors: Partial<FormValues> = {};
    if (!values.name) {
      errors.name = "Name is required";
    }
    if (values.password.length > 0 && values.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    return errors;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const response = await updateUserProfile({
      name: values.name,
      password: values.password,
    });
    if (response.status === 200) {
      setUser((prevUser) => ({
        ...prevUser!,
        name: values.name,
      }));
      setIsEditing(false);
    }
    actions.setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">User Profile</h1>

      {isEditing === false ? (
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
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
        </div>
      ) : (
        <Formik
          initialValues={initialFormValues}
          enableReinitialize
          validate={validate}
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

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
