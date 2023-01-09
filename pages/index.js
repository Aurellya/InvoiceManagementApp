import { useContext } from "react";
import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/Home.module.css";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import { ThemeContext } from "../context/ThemeContext";

export default function Home() {
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      {session ? User({ session, handleSignOut }) : Guest()}
    </div>
  );
}

// Guest
function Guest() {
  return (
    <main className="container mx-auto text-center py-20">
      <h3 className="text-4xl font-bold">Guest Homepage</h3>

      <div className="flex justify-center">
        <Link
          href={"/login"}
          className="mt-5 px-10 py-1 rounded-sm bg-indigo-500 text-gray-50"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}

// Authorize User
function User({ session, handleSignOut }) {
  // theme
  const theme = useContext(ThemeContext);

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
            <h3 className="text-3xl md:text-4xl font-bold">Dashboard</h3>
            <hr className="md:hidden" />
          </div>

          <div
            className={`table-div-custom my-4 md:my-12 rounded-md ${
              theme.dark ? "text-black" : ""
            }`}
          >
            <div>
              <h1 className="text-lg md:text-xl mb-4">
                Welcome, <b>{session.user.name}</b>!
              </h1>
            </div>

            <div class="flex flex-wrap mb-2">
              <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2">
                <div class="bg-green-600 border rounded shadow p-2">
                  <div class="flex flex-row items-center">
                    <div class="flex-shrink pl-1 pr-4">
                      <i class="fa fa-wallet fa-2x fa-fw fa-inverse"></i>
                    </div>
                    <div class="flex-1 text-right">
                      <h5 class="text-white">Total Revenue</h5>
                      <h3 class="text-white text-3xl">
                        Rp 324,900
                        <span class="text-green-400">
                          <i class="fas fa-caret-down"></i>
                        </span>
                      </h3>
                      <h3 class="text-white text-sm">this month</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2">
                <div class="bg-blue-600 border rounded shadow p-2">
                  <div class="flex flex-row items-center">
                    <div class="flex-shrink pl-1 pr-4">
                      <i class="fas fa-users fa-2x fa-fw fa-inverse"></i>
                    </div>
                    <div class="flex-1 text-right">
                      <h5 class="text-white">Registered Customers</h5>
                      <h3 class="text-white text-3xl">
                        13{" "}
                        <span class="text-blue-400">
                          <i class="fas fa-caret-up"></i>
                        </span>
                      </h3>
                      <h3 class="text-white text-sm">customers</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2 xl:pr-3 xl:pl-1">
                <div class="bg-orange-600 border rounded shadow p-2">
                  <div class="flex flex-row items-center">
                    <div class="flex-shrink pl-1 pr-4">
                      <i class="fas fa-user-plus fa-2x fa-fw fa-inverse"></i>
                    </div>
                    <div class="flex-1 text-right pr-1">
                      <h5 class="text-white">Unpaid Invoices</h5>
                      <h3 class="text-white text-3xl">
                        2{" "}
                        <span class="text-orange-400">
                          <i class="fas fa-caret-up"></i>
                        </span>
                      </h3>
                      <h3 class="text-white text-sm">invoices</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2 xl:pl-3 xl:pr-2">
                <div class="bg-purple-600 border rounded shadow p-2">
                  <div class="flex flex-row items-center">
                    <div class="flex-shrink pl-1 pr-4">
                      <i class="fas fa-server fa-2x fa-fw fa-inverse"></i>
                    </div>
                    <div class="flex-1 text-right">
                      <h5 class="text-white">Average Revenue</h5>
                      <h3 class="text-white text-3xl">Rp 567,500</h3>
                      <h3 class="text-white text-sm">monthly</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pr-2 xl:pl-2 xl:pr-3">
                <div class="bg-red-600 border rounded shadow p-2">
                  <div class="flex flex-row items-center">
                    <div class="flex-shrink pl-1 pr-4">
                      <i class="fas fa-tasks fa-2x fa-fw fa-inverse"></i>
                    </div>
                    <div class="flex-1 text-right">
                      <h5 class="text-white">Total Items</h5>
                      <h3 class="text-white text-3xl">70</h3>
                      <h3 class="text-white text-sm">items</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="w-full md:w-1/2 xl:w-1/3 pt-3 px-3 md:pl-2 xl:pl-1">
                <div class="bg-pink-600 border rounded shadow p-2">
                  <div class="flex flex-row items-center">
                    <div class="flex-shrink pl-1 pr-4">
                      <i class="fas fa-inbox fa-2x fa-fw fa-inverse"></i>
                    </div>
                    <div class="flex-1 text-right">
                      <h5 class="text-white">Paid Invoices</h5>
                      <h3 class="text-white text-3xl">
                        3{" "}
                        <span class="text-pink-400">
                          <i class="fas fa-caret-up"></i>
                        </span>
                      </h3>
                      <h3 class="text-white text-sm">invoices</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
