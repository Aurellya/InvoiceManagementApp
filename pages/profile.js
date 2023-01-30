import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";

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

  return (
    <>
      <Head>
        <title>
          {theme.language === "Bahasa" ? "Halaman Profil" : "Profile Page"}
        </title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

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
                href={""}
                // href={`/editProfile/${router.query.id}`}
              >
                <div>{React.createElement(AiFillEdit, { size: "12" })}</div>
                <h2 className="whitespace-pre">Edit</h2>
              </Link>
              <button
                className="group button-custom bg-[#F44645]"
                // onClick={showModalDeleteConfirmation}
              >
                <div>{React.createElement(AiFillDelete, { size: "12" })}</div>
                <h2 className="whitespace-pre">
                  {theme.language === "Bahasa" ? "Hapus" : "Delete"}
                </h2>
              </button>
            </div>
          </div>

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
                <div className="md:col-span-8 h-fit mt-8 md:mt-0 w-full">
                  <h5>
                    <b>
                      {theme.language === "Bahasa"
                        ? "Nama Pengguna: "
                        : "Username: "}
                    </b>
                    <br />
                    {session.user.name
                      ? session.user.name
                      : theme.language === "Bahasa"
                      ? "Tidak Ada Nama"
                      : "No Username"}
                  </h5>

                  <br />

                  <h5>
                    <b>Email: </b>
                    <br />
                    {session.user.email}
                  </h5>

                  <br />

                  <h5>
                    <b>
                      {theme.language === "Bahasa"
                        ? "Nomor Tlp: "
                        : "Phone No: "}
                    </b>
                    <br />
                    +628 1289 1280
                  </h5>

                  <br />

                  <h5>
                    <b>
                      {theme.language === "Bahasa"
                        ? "Dibuat tanggal: "
                        : "Created on: "}
                    </b>
                    <br />
                    12 January 2022
                  </h5>

                  <br />
                </div>

                <hr className="md:hidden my-6" />

                {/* btn group: for mobile view */}
                <div className="flex items-center justify-between md:hidden w-full">
                  <Link
                    className="group button-custom bg-primary"
                    href={""}
                    // href={`/editProfile/${router.query.id}`}
                  >
                    <div>{React.createElement(AiFillEdit, { size: "12" })}</div>
                    <h2 className="whitespace-pre">Edit</h2>
                  </Link>
                  <button
                    className="group button-custom bg-[#F44645]"
                    // onClick={showModalDeleteConfirmation}
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
