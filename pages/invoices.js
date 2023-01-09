import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";

import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";

import { BsPlusLg } from "react-icons/bs";

import ReactLoading from "react-loading";

export default () => {
  // session
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [invoices, setInvoices] = useState();
  const [loading, setLoading] = useState(false);

  const getInvoices = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/invoices");
    const invoicesObj = await res.json();
    const invoices = invoicesObj.data;
    setInvoices(invoices);
    setLoading(false);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    if (page <= Math.ceil(invoices.length / pageSize) && page > 0) {
      setCurrentPage(page);
    }
  };

  const paginateInvoice = paginate(invoices, currentPage, pageSize);

  return (
    <>
      <Head>
        <title>Invoices</title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
            <h3 className="text-3xl md:text-4xl font-bold">Invoices</h3>
            <hr className="md:hidden" />
            <div className="flex justify-end">
              <Link
                className="w-fit button-custom mt-0 bg-[#0E3658]"
                href="/addInvoice"
              >
                <div>{React.createElement(BsPlusLg, { size: "12" })}</div>
                <h2 className="whitespace-pre">Create New</h2>
              </Link>
            </div>
          </div>

          {/* invoices table */}
          <div
            className={`table-div-custom my-4 md:my-12 ${
              theme.dark ? "text-black" : ""
            }`}
          >
            <div>
              <h1 className="text-lg md:text-xl mb-4">Recent Invoices</h1>
            </div>

            {loading && (
              <div className="py-8">
                <div className="mt-9 flex flex-col justify-center items-center">
                  <h3 className="text-xl mb-4 font-bold">Loading</h3>
                  <ReactLoading
                    type="bars"
                    color="#0E3658"
                    height={100}
                    width={50}
                  />
                </div>
              </div>
            )}

            {!loading && !invoices && (
              <div className="py-8">
                <div className="mt-9 flex flex-col justify-center items-center">
                  <h3 className="text-xl mb-4 font-bold">No Data</h3>
                </div>
              </div>
            )}

            {!loading && invoices && (
              <>
                {/* large screen view */}
                <div className="overflow-auto rounded-lg shadow hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                          Invoice No.
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Customer Name
                        </th>
                        <th className="w-38 p-3 text-sm font-semibold tracking-wide text-left">
                          Date
                        </th>
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                          Status
                        </th>
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-center">
                          Total Items
                        </th>
                        <th className="w-38 p-3 text-sm font-semibold tracking-wide text-left">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginateInvoice.map((invoice) => (
                        <tr className="bg-white" key={invoice._id}>
                          <td className="p-3 text-sm text-[#0E3658] font-bold whitespace-nowrap">
                            <Link
                              href={`/invoices/${invoice._id}`}
                              className="transition duration-700 hover:underline"
                            >
                              {invoice._id}
                            </Link>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {invoice.customer_name}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {invoice.date.substring(0, 10)}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <span
                              className={`p-1.5 text-xs font-medium uppercase tracking-wider ${
                                invoice.status === "paid"
                                  ? "text-green-800 bg-green-200"
                                  : "text-gray-800 bg-gray-200"
                              }  rounded-lg bg-opacity-50`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-gray-700 whitespace-nowrap text-center">
                            {invoice.total_items}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {invoice.total.toLocaleString("en-US", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* mobile view */}
                <hr className="md:hidden" />
                <br className="md:hidden" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                  {paginateInvoice.map((invoice) => (
                    <div
                      className="bg-white space-y-3 p-4 pb-6 rounded-lg shadow"
                      key={invoice._id}
                    >
                      <div className="text-sm font-medium text-black break-words">
                        <b>Invoice Id:</b>
                        <br />
                        {invoice._id}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Customer:</b> {invoice.customer_name}
                      </div>
                      <hr />
                      <div className="text-sm font-medium text-black">
                        <b>Date: </b>
                        {invoice.date.substring(0, 10)}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Status:</b> &nbsp;
                        <span
                          className={`p-1.5 text-xs font-medium uppercase tracking-wider ${
                            invoice.status === "paid"
                              ? "text-green-800 bg-green-200"
                              : "text-gray-800 bg-gray-200"
                          } rounded-lg bg-opacity-50`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Total Items: </b>
                        {invoice.total_items}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Total Cost: </b>
                        {invoice.total.toLocaleString("en-US", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        })}
                      </div>

                      <div className="text-center pt-5">
                        <Link
                          className="py-2 px-5 text-xs font-medium uppercase tracking-wider rounded-md bg-[#246A3D] text-white"
                          href={`/invoices/${invoice._id}`}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  items={invoices.length}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </main>
      </section>
    </>
  );
};

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