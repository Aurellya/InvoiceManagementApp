import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../../context/ThemeContext";
import LayoutIn from "../../layout/layoutIn";

import { IoArrowBackOutline } from "react-icons/io5";
import { FaUserEdit } from "react-icons/fa";

export default function changePassword() {
  // auth
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const getProfile = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/api/profile/${session._id}`);
    const profileObj = await res.json();
    const profileData = profileObj.data;
    setProfile(profileData);
    setLoading(false);
  };

  const [data, setData] = useState();

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.username) setData({ username: profile.username });
  }, [profile]);

  // when data changes
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  // handle submit form data
  const submitForm = (e) => {
    e.preventDefault();

    if (!data.password || !data.cpassword) {
      setErrorMsg("Password can't be empty!");
      return false;
    }

    if (data.password != data.cpassword) {
      setErrorMsg("Password do not match!");
      return false;
    }

    var jsonData = {
      password: data.password,
    };

    // Send data to the backend via PUT
    fetch(`http://localhost:3000/api/changePassword/${session._id}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = `/profile`;
      } else {
        setErrorMsg("Failed to Edit Profile! Try Again!");
      }
    });

    // console.log(jsonData);
  };

  return (
    <LayoutIn
      title={
        theme.language === "Bahasa"
          ? "Formulir Ganti Kata Sandi"
          : "Change Password Form"
      }
      role={session.role}
    >
      <main
        className={`pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full max-w-[1536px]`}
      >
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full md:mb-12">
          <div className="flex items-center gap-8">
            <Link
              className={`${
                theme.dark ? "bg-dm_secondary" : "bg-primary"
              } group flex items-center text-sm font-bold gap-2 py-2 px-4 text-white hover:opacity-80 transition duration-700 rounded-md`}
              href={`/profile`}
            >
              <div>
                {React.createElement(IoArrowBackOutline, { size: "12" })}
              </div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Kembali" : "Back"}
              </h2>
            </Link>
            <h3 className="text-3xl md:text-4xl font-bold">
              {theme.language === "Bahasa"
                ? "Formulir Ganti Kata Sandi"
                : "Change Password Form"}
            </h3>
          </div>

          <hr className="md:hidden" />
        </div>

        {/* error msg */}
        {errorMsg != "" && (
          <div
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 md:my:0"
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
            {errorMsg}

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

        {loading && (
          <div className="py-8">
            <div className="mt-9 flex flex-col justify-center items-center">
              <h3 className="text-xl mb-4 font-bold">
                {theme.language === "Bahasa" ? "Memuat" : "Loading"}
              </h3>
              <ReactLoading
                type="bars"
                color="#2b4450"
                height={100}
                width={50}
              />
            </div>
          </div>
        )}

        {!loading && !profile && (
          <div className="py-8">
            <div className="mt-9 flex flex-col justify-center items-center">
              <h3 className="text-xl mb-4 font-bold">
                {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
              </h3>
            </div>
          </div>
        )}

        {/* contents */}
        {!loading && profile && (
          <form className="w-full" onSubmit={submitForm}>
            <div
              className={`table-div-custom my-4 md:my-0 px-6 pt-6 pb-1 md:p-6 ${
                theme.dark ? "text-neutral !bg-dm_secondary" : ""
              }`}
            >
              <div>
                <h2 className="text-lg md:text-xl mb-3">
                  {theme.language === "Bahasa"
                    ? "Rincican Pengguna"
                    : "User Details"}
                </h2>
              </div>

              <hr />
              <br />

              {/* edit customer form */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 pb-2 pt-3 mb-3 md:mb-0">
                {/* left */}
                <div
                  className={`${
                    theme.dark ? "text-neutral" : "text-primary"
                  } lg:col-span-4 flex justify-center items-center lg:mt-[-50px] mb-10 lg:mb-0`}
                >
                  <div
                    className={`${
                      theme.dark ? "border-y-neutral" : "border-y-primary"
                    } border-y-8 rounded-full w-fit p-10 pl-[60px]`}
                  >
                    {React.createElement(FaUserEdit, { size: "120" })}
                  </div>
                </div>

                {/* right */}
                <div className="lg:col-span-6">
                  <div className="lg:grid lg:grid-cols-12">
                    <div className="h-fit mt-8 md:mt-0 lg:col-span-6">
                      {/* username */}
                      <h5>
                        <b>
                          {theme.language === "Bahasa"
                            ? "Nama Pengguna: "
                            : "Username: "}
                        </b>
                        <br />
                        {profile.username}
                      </h5>

                      <br />

                      <h5>
                        <b>Email: </b>
                        <br />
                        {profile.email}
                      </h5>

                      <br />

                      <h5>
                        <b>
                          {theme.language === "Bahasa"
                            ? "Kode Perusahaan: "
                            : "Company Code: "}
                        </b>
                        <br />
                        {profile.group_code}
                      </h5>

                      <br />

                      <h5>
                        <b>
                          {theme.language === "Bahasa" ? "Peran: " : "Role: "}
                        </b>
                        <br />
                        {profile.role}
                      </h5>

                      <br />
                    </div>

                    <div className="lg:col-span-6">
                      <div className="form-group mb-6 ">
                        <label
                          htmlFor="name"
                          className="form-label inline-block mb-2"
                        >
                          <b>
                            {theme.language === "Bahasa"
                              ? "Kata Sandi Baru:"
                              : "New Password:"}
                          </b>
                        </label>
                        <input
                          autoComplete="off"
                          type="text"
                          className={`${
                            theme.dark
                              ? "!bg-dm_secondary text-neutral"
                              : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                          } form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="password"
                          id="password"
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-group mb-6 ">
                        <label
                          htmlFor="name"
                          className="form-label inline-block mb-2"
                        >
                          <b>
                            {theme.language === "Bahasa"
                              ? "Konfirmasi Kata Sandi Baru:"
                              : "Confirm New Password:"}
                          </b>
                        </label>
                        <input
                          autoComplete="off"
                          type="text"
                          className={`${
                            theme.dark
                              ? "!bg-dm_secondary text-neutral"
                              : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                          } form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="cpassword"
                          id="cpassword"
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* submit button */}
                  <div className="text-center mt-4">
                    <button
                      type="submit"
                      className="group text-sm font-bold gap-2 py-2 px-8 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
                    >
                      {theme.language === "Bahasa" ? "Simpan" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </LayoutIn>
  );
}

export async function getServerSideProps({ req }) {
  // handle session
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        premanent: false,
      },
    };
  }

  // authorize user return session
  return {
    props: { session },
  };
}
