import React, { useState, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import Layout from "../layout/layout";
import { ThemeContext } from "../context/ThemeContext";
import login_validate from "../lib/validate";
import styles from "../styles/Form.module.css";

import { HiAtSymbol, HiFingerPrint } from "react-icons/hi";

const Login = () => {
  // theme
  const theme = useContext(ThemeContext);

  // form
  const [show, setShow] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: login_validate,
    onSubmit,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(values) {
    setLoading(true);

    const status = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: "/",
    });

    if (status.ok && !status.error) {
      router.push(status.url);
    } else {
      setErrorMsg(status.error);
      setLoading(false);
    }
  }

  // Google Handler function
  // async function handleGoogleSignin() {
  //   signIn("google", { callbackUrl: "/" });
  // }

  return (
    <Layout>
      <Head>
        <title>Login</title>
      </Head>

      <section className="w-10/12 md:w-3/4 mx-auto flex flex-col md:gap-10">
        {/* header */}
        <div className="title">
          <h1 className="text-gray-800 text-4xl font-bold pb-4 md:py-4">
            Login
          </h1>
          <p className="w-3/4 mx-auto text-gray-400">
            Welcome to ASC App! Manage your invoice with Us.
          </p>
        </div>

        {/* error msg */}
        {errorMsg != "" && (
          <div
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-[-20px]"
            role="alert"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              dataprefix="fas"
              dataicon="times-circle"
              className="w-4 h-4 mr-2 fill-current"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
              ></path>
            </svg>
            <div className="px-2 text-left">{errorMsg}</div>

            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMsg("")}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>{theme.language === "Bahasa" ? "Tutup" : "Close"}</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        )}

        {/* form */}
        <form
          className={`flex flex-col gap-5 text-left ${
            errorMsg ? "mt-[-10px]" : "mt-4"
          }`}
          onSubmit={formik.handleSubmit}
        >
          {/* email */}
          <div>
            <div
              className={`${styles.input_group} ${
                formik.errors.email && formik.touched.email
                  ? "border-[#F44645]"
                  : ""
              }`}
            >
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input_text}
                {...formik.getFieldProps("email")}
              />
              <span className="icon flex items-center px-4">
                <HiAtSymbol size={25} />
              </span>
            </div>
            <div className="w-fit text-sm text-[#F44645] mt-2">
              {formik.errors.email && formik.touched.email && (
                <div>
                  <p>* {formik.errors.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* password */}
          <div>
            <div
              className={`${styles.input_group} ${
                formik.errors.password && formik.touched.password
                  ? "border-[#F44645]"
                  : ""
              }`}
            >
              <input
                type={`${show ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                className={styles.input_text}
                {...formik.getFieldProps("password")}
              />
              <span
                className="icon flex items-center px-4"
                onClick={() => setShow(!show)}
              >
                <HiFingerPrint size={25} />
              </span>
            </div>
            <div className="w-fit text-sm text-[#F44645] mt-2">
              {formik.errors.password && formik.touched.password && (
                <div>
                  <p>* {formik.errors.password}</p>
                </div>
              )}
            </div>
          </div>

          {/* login buttons */}
          <div className="input-button">
            <button type="submit" className={styles.button}>
              {!loading && "Login"}
              {loading && <div>Loading . . .</div>}
            </button>
          </div>

          {/* Implemented soon  */}
          {/* <div className="input-button">
            <button
              type="button"
              onClick={handleGoogleSignin}
              className={styles.button_custom}
            >
              Sign In with Google{" "}
              <Image src={"/assets/google.svg"} width="20" height={20} alt="" />
            </button>
          </div> */}
        </form>

        {/* register button */}
        <p className="text-center text-gray-400 mt-10">
          don&apos;t have an account yet?{" "}
          <Link href={"/register"} className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </section>
    </Layout>
  );
};

export default Login;
