"use client";
import { Formik } from "formik";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { AuthService } from "../../services/auth-service";

export default function SignupPage() {
  return (
    <div>
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          name: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            await AuthService.signUpUser({
              email: values.email,
              password: values.password,
              name: values.name,
            });

            // Once signed up, immediately sign the user in so they can have a session
            await AuthService.signInCredentials({
              email: values.email,
              password: values.password,
              isSigningUp: true,
              callbackUrl: "/home", // TODO: update this to the dashboard page
            });
          } catch (error: any) {
            console.error(error.message);
          }
        }}
        validate={(values) => {
          // TODO: this logic could be moved to a shared validation file?
          const errors: Record<string, string> = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 8) {
            errors.password = "Must be at least 8 characters";
          }

          if (!values.confirmPassword) {
            errors.confirmPassword = "Required";
          } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "Passwords must match";
          }

          if (!values.name) {
            errors.name = "Required";
          }
          return errors;
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-y-2">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="E-mail address"
                className="input input-bordered w-full"
              />
              <div className="text-orange-600">
                {errors.email && touched.email && errors.email}
              </div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
                className="input input-bordered w-full"
              />
              <div className="text-orange-600">
                {errors.name && touched.name && errors.name}
              </div>
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="input input-bordered w-full"
              />
              <div className="text-orange-600">
                {errors.password && touched.password && errors.password}
              </div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                className="input input-bordered w-full"
              />
              <div className="text-orange-600">
                {errors.confirmPassword &&
                  touched.confirmPassword &&
                  errors.confirmPassword}
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Sign Up
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert("Sign up with Google");
                }}
              >
                <FaGoogle /> Sign up with Google
              </button>
              <div className="flex justify-center">
                <p>
                  Already have an account?{" "}
                  <Link href={"signin"} className="text-cyan-500">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
