import React from "react";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import { AiFillEdit } from "react-icons/ai";

export default () => {
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  return (
    <>
      <Head>
        <title>Profile Page</title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />
        <main className="container py-12 mx-14">
          <h3 className="text-4xl font-bold">Profile</h3>

          <div className="details mt-10">
            <h5>
              <b>Username: </b>
              {session.user.name ? session.user.name : "No Username"}
            </h5>
            <h5>
              <b>Email: </b>
              {session.user.email}
            </h5>
            <div className="flex items-center gap-2 my-9">
              <button className="group flex items-center text-sm font-bold gap-2 py-2 px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md">
                <div>{React.createElement(AiFillEdit, { size: "12" })}</div>
                <h2 className="whitespace-pre">Edit Details</h2>
              </button>
              {/* <button className="group flex items-center text-sm font-bold gap-2 py-2 px-4 bg-[#F44645] text-white hover:opacity-80 transition duration-700 rounded-md">
              <div>{React.createElement(AiFillDelete, { size: "12" })}</div>
              <h2 className="whitespace-pre">Delete Account</h2>
            </button> */}
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
