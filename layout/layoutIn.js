import React from "react";
import Head from "next/head";
import { signOut } from "next-auth/react";

import Sidebar from "../components/Sidebar";

export default function LayoutIn({ children, title, role }) {
  function handleSignOut() {
    signOut();
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <section className="flex">
        {role && <Sidebar handleSignOut={handleSignOut} role={role} />}

        {children}
      </section>
    </>
  );
}
