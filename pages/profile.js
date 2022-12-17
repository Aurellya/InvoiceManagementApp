import Link from "next/link";
import { getSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";

export default () => {
  return (
    <section className="flex gap-6">
      <Sidebar />
      <main className="container mx-auto text-center py-20">
        <h3 className="text-4xl font-bold">Profile Page</h3>

        <Link href={"/"}>Home Page</Link>
      </main>
    </section>
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
