"use client";
import { Formik } from "formik";
import Link from "next/link";
import { CiUser } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { AuthService } from "../../services/auth-service";

export default function SignupPage() {
  const handleGoogleSignIn = async () => {
    try {
      await AuthService.signInGoogle();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <section className="w-full flex justify-center mb-8">
        <CiUser
          size={72}
          className=" line-clamp-1 input-bordered text-gray-400 "
        />
      </section>
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
            <div className="w-full flex flex-col gap-y-3">
              {/* inputs  */}
              <section>
                <label htmlFor="email" className="text-lg font-normal">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  placeholder="E-mail address"
                  className={`input input-bordered w-full rounded-full ${
                    errors.email && touched.email && errors.email
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="text-orange-600 text-sm">
                  {errors.email && touched.email && errors.email}
                </div>
              </section>

              <section>
                <label htmlFor="name" className="text-lg font-normal">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className={`input input-bordered w-full rounded-full ${
                    errors.name && touched.name && errors.name
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="text-orange-600 text-sm">
                  {errors.name && touched.name && errors.name}
                </div>
              </section>

              <section>
                <label htmlFor="email" className="font-normal text-lg">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className={`input input-bordered w-full rounded-full ${
                    errors.password && touched.password && errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="text-orange-600 text-sm">
                  {errors.password && touched.password && errors.password}
                </div>
              </section>

              <section>
                <label
                  htmlFor="confirmPassword"
                  className="text-lg font-normal"
                >
                  Repeat password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  className={`input input-bordered w-full rounded-full ${
                    errors.confirmPassword &&
                    touched.confirmPassword &&
                    errors.confirmPassword
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <div className="text-orange-600">
                  {errors.confirmPassword &&
                    touched.confirmPassword &&
                    errors.confirmPassword}
                </div>
              </section>
              {/* btns */}
              <section className="flex flex-col gap-y-2">
                <button
                  type="submit"
                  className="btn btn-primary rounded-full"
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
                <p className="text-center text-sm">Or</p>
                <button
                  className="btn rounded-full"
                  onClick={handleGoogleSignIn}
                >
                  <FaGoogle /> Continue with Google
                </button>
              </section>

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
