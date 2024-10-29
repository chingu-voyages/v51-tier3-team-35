"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiUser } from "react-icons/ci";
import { FaGoogle } from "react-icons/fa";
import { AuthService } from "../../services/auth-service";

export default function SigninPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const handleGoogleSignIn = async () => {
    try {
      await AuthService.signInGoogle();
    } catch (error: any) {
      setApiError(error.message);
    }
  };
  return (
    <div>
      <section className="w-full flex justify-center mb-12">
        <CiUser
          size={72}
          className=" line-clamp-1 input-bordered text-gray-400 "
        />
      </section>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const callbackUrl = "/home";
          const res = await AuthService.signInCredentials({
            email: values.email,
            password: values.password,
            redirect: false,
            callbackUrl: callbackUrl,
          });

          if (res.status === "fail") {
            setApiError(res.message!);
            return;
          }

          router.push(callbackUrl);
        }}
        validate={(values) => {
          const errors: Record<string, string> = {};
          if (!values.email) {
            errors.email = "Required";
          }

          if (!values.password) {
            errors.password = "Required";
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
            <div className="w-full flex flex-col gap-y-6">
              <section>
                <label className="font-normal text-lg py-" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className={`input input-bordered w-full rounded-full ${
                    errors.email && touched.email && errors.email
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="E-mail address"
                />
                <div className="text-orange-600 text-sm">
                  {errors.email && touched.email && errors.email}
                </div>
              </section>

              <section>
                <label className="font-normal text-lg" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className={`input input-bordered w-full rounded-full ${
                    errors.password && touched.password && errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Password"
                />
                <div className="text-orange-600 text-sm">
                  {errors.password && touched.password && errors.password}
                </div>
              </section>

              {/* API Errors here */}
              {apiError && (
                <div className="text-red-600 text-sm">{apiError}</div>
              )}

              {/* btns  */}
              <section className="w-full flex flex-col gap-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary rounded-full"
                >
                  Sign in
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
                  Don't have an account?{" "}
                  <Link href={"signup"} className="text-cyan-500">
                    Sign up
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
