import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Layout from "../layout/layout";
import Link from "next/link";
import styles from "../styles/Form.module.css";
import {
  HiAtSymbol,
  HiFingerPrint,
  HiOutlineUser,
  HiOutlineQrcode,
} from "react-icons/hi";
import { useFormik } from "formik";
import { registerValidate } from "../lib/validate";
import { useRouter } from "next/router";
import { ThemeContext } from "../context/ThemeContext";

export default function Register() {
  // theme
  const theme = useContext(ThemeContext);

  const [show, setShow] = useState({ password: false, cpassword: false });
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      cpassword: "",
      companycode: "",
    },
    validate: registerValidate,
    onSubmit,
  });

  const [data, setData] = useState();
  const [ok, setOk] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values) {
    setLoading(true);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    };

    let obj;

    // if user enter company code
    if (values.companycode) {
      // check if company code is valid
      const res = await fetch(
        `http://localhost:3000/api/validateGroup/${values.companycode}`
      );
      obj = await res.json();
    }

    // if company code is valid ot if user do not enter company code
    if ((obj && obj.result) || !values.companycode) {
      await fetch("http://localhost:3000/api/auth/signup", options)
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        });
    } else {
      setData({
        status: false,
        error: "Invalid Company Code!",
        error_id: "Kode Perusahaan Tidak Valid!",
      });
    }
  }

  useEffect(() => {
    if (data) {
      if (data.status) {
        setOk(true);
        showModal(
          theme.language === "Bahasa"
            ? "Akun anda telah berhasil Terdaftar! \nMengarahkan anda ke Halaman Login ..."
            : "Your account is created Successfully! \nRedirecting you to Login Page ...",
          "Ok"
        );
      } else if (data.error) {
        setOk(false);
        showModal(
          theme.language === "Bahasa"
            ? "Gagal! " + data.error_id
            : "Error! " + data.error,
          theme.language === "Bahasa" ? "Coba Lagi" : "Try Again"
        );
      } else {
        setOk(false);
        showModal(
          theme.language === "Bahasa"
            ? "Gagal! Akun and tidak berhasil dibuat!"
            : "Error! Your account can not be created!",
          theme.language === "Bahasa" ? "Coba Lagi" : "Try Again"
        );
      }
    }

    setLoading(false);
  }, [data]);

  // function to display modal dialog
  function showModal(text, btn_txt) {
    document.getElementById("modal_txt").innerText = text;
    document.getElementById("btn_txt").innerText = btn_txt;
    document.getElementById("modal").style.display = "block";
  }

  const closeModal = (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";
    if (data && data.status) router.push("http://localhost:3000");
  };

  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>

      <section className="w-3/4 mx-auto flex flex-col gap-10">
        {/* modal */}
        <div className="hidden" id="modal">
          <div className="z-20 bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
            <div className="bg-white px-10 py-8 rounded-md text-center">
              <h1
                className="text-xl mb-6 font-bold whitespace-pre-wrap"
                id="modal_txt"
              ></h1>
              <button
                className={`${
                  ok ? "bg-tertiary" : "bg-[#F44645]"
                } px-7 py-2 ml-4 rounded-md text-md text-white font-semibold`}
                onClick={closeModal}
                id="btn_txt"
              ></button>
            </div>
          </div>
        </div>

        <div className="title">
          <h1 className="text-gray-800 text-4xl font-bold py-4">Register</h1>
          <p className="w-3/4 mx-auto text-gray-400">
            Welcome to ASC App! Register and Automate Your Invoicing with Us.
          </p>
        </div>

        {/* form */}
        <form
          className="flex flex-col gap-5 text-left"
          onSubmit={formik.handleSubmit}
        >
          <div>
            <div
              className={`${styles.input_group} ${
                formik.errors.username && formik.touched.username
                  ? "border-[#F44645]"
                  : ""
              }`}
            >
              <input
                type="text"
                name="Username"
                placeholder="Username"
                className={styles.input_text}
                {...formik.getFieldProps("username")}
              />
              <span className="icon flex items-center px-4">
                <HiOutlineUser size={25} />
              </span>
            </div>
            <div className="w-fit text-sm text-[#F44645] mt-2">
              {formik.errors.username && formik.touched.username && (
                <div>
                  <p>* {formik.errors.username}</p>
                </div>
              )}
            </div>
          </div>

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

          <div>
            <div
              className={`${styles.input_group} ${
                formik.errors.password && formik.touched.password
                  ? "border-[#F44645]"
                  : ""
              }`}
            >
              <input
                type={`${show.password ? "text" : "password"}`}
                name="password"
                placeholder="Password"
                className={styles.input_text}
                {...formik.getFieldProps("password")}
              />
              <span
                className="icon flex items-center px-4"
                onClick={() => setShow({ ...show, password: !show.password })}
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

          <div>
            <div
              className={`${styles.input_group} ${
                formik.errors.cpassword && formik.touched.cpassword
                  ? "border-[#F44645]"
                  : ""
              }`}
            >
              <input
                type={`${show.cpassword ? "text" : "password"}`}
                name="cpassword"
                placeholder="Confirm Password"
                className={styles.input_text}
                {...formik.getFieldProps("cpassword")}
              />
              <span
                className="icon flex items-center px-4"
                onClick={() => setShow({ ...show, cpassword: !show.cpassword })}
              >
                <HiFingerPrint size={25} />
              </span>
            </div>
            <div className="w-fit text-sm text-[#F44645] mt-2">
              {formik.errors.cpassword && formik.touched.cpassword && (
                <div>
                  <p>* {formik.errors.cpassword}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <div
              className={`${styles.input_group} ${
                formik.errors.companycode && formik.touched.companycode
                  ? "border-[#F44645]"
                  : ""
              }`}
            >
              <input
                type="text"
                name="Companycode"
                id="cc"
                placeholder="Company Code"
                className={styles.input_text}
                {...formik.getFieldProps("companycode")}
              />
              <span className="icon flex items-center px-4">
                <HiOutlineQrcode size={25} />
              </span>
            </div>
            <div className="w-fit text-sm text-gray-300 mt-2 ml-2">
              <p>Note: Leave it blank, if you register as an admin!</p>
            </div>
            <div className="w-fit text-sm text-[#F44645] mt-2">
              {formik.errors.companycode && formik.touched.companycode && (
                <div>
                  <p>* {formik.errors.companycode}</p>
                </div>
              )}
            </div>
          </div>

          {/* login buttons */}
          <div className="input-button">
            <button type="submit" className={styles.button}>
              {!loading && "Sign Up"}
              {loading && <div>Loading . . .</div>}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400 ">
          Have an account?{" "}
          <Link href={"/login"} className="text-primary">
            Sign In
          </Link>
        </p>
      </section>
    </Layout>
  );
}
