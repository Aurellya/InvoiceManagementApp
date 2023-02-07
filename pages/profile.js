import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import ReactLoading from "react-loading";

import Sidebar from "../components/Sidebar";
import { ThemeContext } from "../context/ThemeContext";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { TiUserOutline } from "react-icons/ti";

export default () => {
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const getProfile = async () => {
    setLoading(true);
    const res = await fetch(`http://localhost:3000/api/profile/${session._id}`);
    const profileObj = await res.json();
    const profileData = await profileObj.data;
    setProfile(profileData);
    setLoading(false);
  };

  const [staff, setStaff] = useState();
  const [staffLoaded, setStaffLoaded] = useState();

  const getStaff = async () => {
    const res = await fetch(
      `http://localhost:3000/api/staffs/${session.group_code}`
    );
    const staffObj = await res.json();
    const staffData = await staffObj.data;
    setStaff(staffData);
  };

  useEffect(() => {
    getProfile();
    getStaff();
  }, []);

  useEffect(() => {
    if (staff && !staffLoaded) {
      let selectDiv = document.getElementById("staff");
      for (let s of staff) {
        if (s._id != session._id) {
          const newOption = document.createElement("option");
          newOption.value = s._id;
          newOption.text = s.username + " : " + s.email;
          selectDiv.appendChild(newOption);
        }
      }

      setStaffLoaded(true);
    }
  }, [staff]);

  // function to display delete confirmation dialog
  function showModalDeleteConfirmation() {
    document.getElementById("modal").style.display = "block";
  }

  const cancelDeleteAccount = (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";
    document.getElementById("modal2").style.display = "none";
  };

  const deleteAcc = () => {
    // Delete account
    fetch(`http://localhost:3000/api/profile/${session._id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        signOut();
      } else {
        setErrorMsg("Failed to Delete an Account! Try Again!");
      }
    });
  };

  // function to change admin
  const changeAdmin = (e) => {
    e.preventDefault();

    let val = document.getElementById("staff").value;

    if (val == "") {
      return false;
    }

    var jsonData = {
      _id: val,
    };

    // call API to change admin role
    fetch(`http://localhost:3000/api/changeAdmin`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        deleteAcc();
      } else {
        setErrorMsg("Failed to Delete Acc! Try Again!");
      }
    });
  };

  // function to delete an account
  const deleteAccountModal = async (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";

    // case 1a: if admin, show modal to reassign admin from existing staff member
    // change role of the chosen user to admin
    if (session.role == "admin" && staff && staff.length > 0) {
      //show modal: if got staff
      document.getElementById("modal2").style.display = "block";
    }

    // case 1b: if no staff proceed to delete acc
    // case 2: if delete acc staff
    else {
      deleteAcc();
    }
  };

  return (
    <>
      <Head>
        <title>
          {theme.language === "Bahasa" ? "Halaman Profil" : "Profile Page"}
        </title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} role={session.role} />

        <main className="container py-12 mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between w-full md:mb-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold">
                {theme.language === "Bahasa" ? "Profil" : "Profile"}
              </h3>
            </div>

            {/* btn group: large screen view */}
            <div className="items-center gap-2 hidden md:flex">
              <Link
                className={`group button-custom ${
                  theme.dark ? "bg-dm_secondary" : "bg-primary"
                }`}
                href={`/editProfile/${session._id}`}
              >
                <div>{React.createElement(AiFillEdit, { size: "12" })}</div>
                <h2 className="whitespace-pre">Edit</h2>
              </Link>
              <button
                className="group button-custom bg-[#F44645]"
                onClick={showModalDeleteConfirmation}
              >
                <div>{React.createElement(AiFillDelete, { size: "12" })}</div>
                <h2 className="whitespace-pre">
                  {theme.language === "Bahasa" ? "Hapus" : "Delete"}
                </h2>
              </button>
            </div>
          </div>

          {/* modal */}
          <div className="hidden" id="modal">
            <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
              <div className="bg-white px-10 py-8 rounded-md text-center">
                <h1 className="text-xl mb-6 font-bold">
                  {theme.language === "Bahasa"
                    ? "Apakah Kamu Yakin Mau Menghapus Akun?"
                    : "Do you Want Delete Account?"}
                </h1>
                <button
                  className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                  onClick={cancelDeleteAccount}
                >
                  {theme.language === "Bahasa" ? "Tidak" : "No"}
                </button>
                <button
                  className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                  onClick={deleteAccountModal}
                >
                  {theme.language === "Bahasa" ? "Ya" : "Yes"}
                </button>
              </div>
            </div>
          </div>

          {/* modal2 */}
          <div className="hidden" id="modal2">
            <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
              <div className="bg-white px-10 py-8 rounded-md text-center">
                <div className="flex flex-col items-center">
                  <label htmlFor="staff" className="text-xl mb-6 font-bold">
                    Choose New Admin for Your Company:
                  </label>

                  <select name="staff" id="staff" defaultValue={""}>
                    <option value="" disabled>
                      -- Select One --
                    </option>
                  </select>
                </div>

                <div className="flex justify-center gap-4 mt-14 mx-auto">
                  <button
                    className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                    onClick={cancelDeleteAccount}
                  >
                    {theme.language === "Bahasa" ? "Batal" : "Cancel"}
                  </button>
                  <button
                    className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                    onClick={changeAdmin}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* error msg */}
          {errorMsg != "" && (
            <div
              className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 md:my:0"
              role="alert"
            >
              <svg
                ariaHidden="true"
                focusable="false"
                dataPrefix="fas"
                dataIcon="times-circle"
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
                class="absolute top-0 bottom-0 right-0 px-4 py-3"
                onClick={() => setErrorMsg("")}
              >
                <svg
                  class="fill-current h-6 w-6 text-red-500"
                  role="button"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <title>
                    {theme.language === "Bahasa" ? "Tutup" : "Close"}
                  </title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </button>
            </div>
          )}

          {/* content */}
          <div
            className={`table-div-custom my-4 md:my-0 p-6 block mb-4 md:mb-0 ${
              theme.dark ? "text-neutral !bg-dm_secondary" : ""
            }`}
          >
            <div>
              <h1 className="text-lg md:text-xl mb-3">
                {theme.language === "Bahasa"
                  ? "Rincian Pengguna"
                  : "User Details"}
              </h1>
            </div>

            <hr />
            <br />

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

            {!loading && profile && (
              <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 pb-0 md:pb-0 pt-3">
                {/* left */}
                <div
                  className={`${
                    theme.dark ? "text-neutral" : "text-primary"
                  } lg:col-span-4 flex justify-center items-center mb-0 lg:mt-[-20px]`}
                >
                  <div
                    className={`${
                      theme.dark ? "border-y-neutral" : "border-y-primary"
                    } border-y-8 rounded-full w-fit p-3`}
                  >
                    {React.createElement(TiUserOutline, { size: "220" })}
                  </div>
                </div>

                {/* right */}
                <div className="flex flex-col lg:flex-row md:mt-[40px] lg:mt-0 lg:col-span-8">
                  <div className="flex gap-32">
                    <div className="md:col-span-8 h-fit mt-8 md:mt-0 w-full">
                      <h5>
                        <b>
                          {theme.language === "Bahasa"
                            ? "Nama Pengguna: "
                            : "Username: "}
                        </b>
                        <br />
                        {profile.username
                          ? profile.username
                          : theme.language === "Bahasa"
                          ? "Tidak Ada Nama"
                          : "No Username"}
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

                    <div>
                      <Link
                        className={`group button-custom ${
                          theme.dark ? "bg-dm_secondary" : "bg-primary"
                        }`}
                        href={`/changePassword/${session._id}`}
                      >
                        <h2 className="whitespace-pre">Change Password</h2>
                      </Link>
                    </div>
                  </div>

                  <hr className="md:hidden my-6" />

                  {/* btn group: for mobile view */}
                  <div className="flex items-center justify-between md:hidden w-full">
                    <Link
                      className="group button-custom bg-primary"
                      href={`/editProfile/${session._id}`}
                    >
                      <div>
                        {React.createElement(AiFillEdit, { size: "12" })}
                      </div>
                      <h2 className="whitespace-pre">Edit</h2>
                    </Link>
                    <button
                      className="group button-custom bg-[#F44645]"
                      onClick={showModalDeleteConfirmation}
                    >
                      <div>
                        {React.createElement(AiFillDelete, { size: "12" })}
                      </div>
                      <h2 className="whitespace-pre">
                        {theme.language === "Bahasa" ? "Hapus" : "Delete"}
                      </h2>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </section>
    </>
  );
};

export async function getServerSideProps({ req }) {
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
