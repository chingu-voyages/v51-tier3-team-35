"use client";

import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { AuthService } from "../services/auth-service";

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
            isSigningUp: false,
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
            <div className="w-full flex flex-col gap-y-2">
              <input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                className="input input-bordered w-full"
                placeholder="E-mail address"
              />
              <div className="text-orange-600">
                {errors.email && touched.email && errors.email}
              </div>

              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                className="input input-bordered w-full"
                placeholder="Password"
              />
              <div className="text-orange-600">
                {errors.password && touched.password && errors.password}
              </div>
              {/* API Errors here */}
              {apiError && <div className="text-red-600">{apiError}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Sign in
              </button>
              <button className="btn btn-primary" onClick={handleGoogleSignIn}>
                <FaGoogle /> Sign in with Google
              </button>
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
