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
  const [priceLists, setPriceLists] = useState();
  const [loading, setLoading] = useState(false);

  const getPriceLists = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/priceLists");
    const priceListsObj = await res.json();
    const priceLists = priceListsObj.data;
    setPriceLists(priceLists);
    setLoading(false);
  };

  useEffect(() => {
    getPriceLists();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    if (page <= Math.ceil(priceLists.length / pageSize) && page > 0) {
      setCurrentPage(page);
    }
  };

  const paginatePriceLists = paginate(priceLists, currentPage, pageSize);

  return (
    <>
      <Head>
        <title>Price List</title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
            <h3 className="text-3xl md:text-4xl font-bold">Price List</h3>
            <hr className="md:hidden" />
            <div className="flex justify-end">
              <Link
                className="w-fit button-custom mt-0 bg-primary"
                href="/addPriceList"
              >
                <div>{React.createElement(BsPlusLg, { size: "12" })}</div>
                <h2 className="whitespace-pre">Create New</h2>
              </Link>
            </div>
          </div>

          {/* priceLists table */}
          <div
            className={`table-div-custom p-6 my-4 md:my-12 ${
              theme.dark ? "text-black" : ""
            }`}
          >
            <div>
              <h1 className="text-lg md:text-xl mb-4">Item Details</h1>
            </div>

            {loading && (
              <div className="py-8">
                <div className="mt-9 flex flex-col justify-center items-center">
                  <h3 className="text-xl mb-4 font-bold">Loading</h3>
                  <ReactLoading
                    type="bars"
                    color="#2b4450"
                    height={100}
                    width={50}
                  />
                </div>
              </div>
            )}

            {!loading && !priceLists && (
              <div className="py-8">
                <div className="mt-9 flex flex-col justify-center items-center">
                  <h3 className="text-xl mb-4 font-bold">No Data</h3>
                </div>
              </div>
            )}

            {!loading && priceLists && (
              <>
                {/* large screen view */}
                <div className="overflow-auto rounded-lg shadow hidden md:block">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                          Item ID.
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Product Name
                        </th>
                        <th className="w-64 p-3 text-sm font-semibold tracking-wide text-left">
                          Amount (/Unit)
                        </th>
                        <th className="w-64 p-3 text-sm font-semibold tracking-wide text-left">
                          Price
                        </th>
                        <th className="w-64 p-3 text-sm font-semibold tracking-wide text-left">
                          Remarks
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {paginatePriceLists.map((item) => (
                        <tr className="bg-white" key={item._id}>
                          <td className="p-3 text-sm text-primary font-bold whitespace-nowrap">
                            <Link
                              href={`/priceList/${item._id}`}
                              className="transition duration-700 hover:underline"
                            >
                              {item._id}
                            </Link>
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.product_name}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.amount + " " + item.unit}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.remarks
                              ? item.remarks.length > 20
                                ? item.remarks.slice(0, 20) + " ..."
                                : item.remarks
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
                  {paginatePriceLists.map((item) => (
                    <div
                      className="bg-white space-y-3 p-4 pb-6 rounded-lg shadow"
                      key={item._id}
                    >
                      <div className="text-sm font-medium text-black break-words">
                        <b>Item ID.</b>
                        <br />
                        {item._id}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Product Name: </b>
                        {item.product_name}
                      </div>
                      <hr />
                      <div className="text-sm font-medium text-black">
                        <b>Amount (/Unit): </b>
                        {item.amount + " " + item.unit}
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Price: </b>
                        <span className="text-sm font-medium text-black">
                          {item.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-black">
                        <b>Remarks: </b>
                        {item.remarks ? item.remarks : "-"}
                      </div>

                      <div className="text-center pt-5">
                        <Link
                          className="py-2 px-5 text-xs font-medium uppercase tracking-wider rounded-md bg-tertiary text-white"
                          href={`/priceList/${item._id}`}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination
                  items={priceLists.length}
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
