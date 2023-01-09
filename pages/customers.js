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
  const [customers, setCustomers] = useState();
  const [loading, setLoading] = useState(false);

  const getCustomers = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/customers");
    const customersObj = await res.json();
    const customers = customersObj.data;
    setCustomers(customers);
    setLoading(false);
  };

  useEffect(() => {
    getCustomers();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    if (page <= Math.ceil(customers.length / pageSize) && page > 0) {
      setCurrentPage(page);
    }
  };

  const paginateCustomer = paginate(customers, currentPage, pageSize);

  return (
    <>
      <Head>
        <title>Customers</title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
            <h3 className="text-3xl md:text-4xl font-bold">Customers</h3>
            <hr className="md:hidden" />
            <div className="flex justify-end">
              <Link
                className="w-fit button-custom mt-0 bg-primary"
                href="/addCustomer"
              >
                <div>{React.createElement(BsPlusLg, { size: "12" })}</div>
                <h2 className="whitespace-pre">Create New</h2>
              </Link>
            </div>
          </div>

          {/* customers table */}
          <div
            className={`table-div-custom my-4 md:my-12 ${
              theme.dark ? "text-black" : ""
            }`}
          >
            <div>
              <h1 className="text-lg md:text-xl mb-4">Customer Details</h1>
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

            {!loading && !customers && (
              <div className="py-8">
                <div className="mt-9 flex flex-col justify-center items-center">
                  <h3 className="text-xl mb-4 font-bold">No Data</h3>
                </div>
              </div>
            )}

            {!loading && customers && (
              <>
                {/* large screen view */}
                <div className="overflow-auto rounded-lg shadow hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                          Customer No.
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Customer Name
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Phone No.
                        </th>
                        <th className="w-64 p-3 text-sm font-semibold tracking-wide text-left">
                          Email
                        </th>
                        <th className="w-72 p-3 text-sm font-semibold tracking-wide text-left">
                          Address
                        </th>
                        <th className="w-52 p-3 text-sm font-semibold tracking-wide text-left">
                          Remarks
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginateCustomer.map((customer) => (
                        <tr className="bg-white" key={customer._id}>
                          <td className="p-3 text-sm text-primary font-bold whitespace-nowrap">
                            <Link
                              href={`/customers/${customer._id}`}
                              className="transition duration-700 hover:underline"
                            >
                              {customer._id}
                            </Link>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {customer.name}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {customer.phone_no}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {customer.email.length > 25
                              ? customer.email.slice(0, 25) + " ..."
                              : customer.email}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {customer.address.length > 30
                              ? customer.address.slice(0, 30) + " ..."
                              : customer.address}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {customer.remarks
                              ? customer.remarks.length > 20
                                ? customer.remarks.slice(0, 20) + " ..."
                                : customer.remarks
                              : "-"}
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
                  {paginateCustomer.map((customer) => (
                    <div
                      className="bg-white space-y-3 p-4 pb-6 rounded-lg shadow"
                      key={customer._id}
                    >
                      <div className="text-sm font-medium text-black break-words">
                        <b>Customer No.</b>
                        <br />
                        {customer._id}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Name: </b>
                        {customer.name}
                      </div>
                      <hr />
                      <div className="text-sm font-medium text-black">
                        <b>Phone No.: </b>
                        {customer.phone_no}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Email: </b>
                        <span className="text-sm font-medium text-black">
                          {customer.email}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Address: </b>
                        {customer.address}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Remarks: </b>
                        {customer.remarks ? customer.remarks : "-"}
                      </div>

                      <div className="text-center pt-5">
                        <Link
                          className="py-2 px-5 text-xs font-medium uppercase tracking-wider rounded-md bg-tertiary text-white"
                          href={`/customers/${customer._id}`}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  items={customers.length}
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
