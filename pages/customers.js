import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../context/ThemeContext";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";
import LayoutIn from "../layout/layoutIn";

import { BsPlusLg } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";

export default () => {
  // session
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [customers, setCustomers] = useState();
  const [loading, setLoading] = useState(false);

  const getCustomers = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/mycustomers/${session.group_code}`
    );
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

  const [paginateCustomer, setPaginateCustomer] = useState();

  useEffect(() => {
    if (customers) {
      setPaginateCustomer(paginate(customers, currentPage, pageSize));
    }
  }, [customers]);

  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    if (customers) {
      let filteredCustomer = customers.filter((p) => p.name.includes(keyword));
      setPaginateCustomer(paginate(filteredCustomer, currentPage, pageSize));
    }
  }, [keyword]);

  const search = (e) => {
    e.preventDefault();
    if (document.getElementById("c_name")) {
      setKeyword(document.getElementById("c_name").value);
    }
  };

  return (
    <LayoutIn
      title={theme.language === "Bahasa" ? "Pelanggan" : "Customers"}
      role={session.role}
    >
      <main
        className={`pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full ${
          loading || (!loading && (!customers || customers.length == 0))
            ? "md:w-full"
            : "md:w-auto"
        } lg:w-full max-w-[1536px]`}
      >
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
          <h3 className="text-3xl md:text-4xl font-bold">
            {theme.language === "Bahasa" ? "Pelanggan" : "Customers"}
          </h3>
          <hr className="md:hidden" />
          <div className="flex justify-end">
            <Link
              className={`w-fit button-custom mt-0 bg-primary ${
                theme.dark ? "bg-dm_secondary" : "bg-primary"
              }`}
              href="/addCustomer"
            >
              <div>{React.createElement(BsPlusLg, { size: "12" })}</div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Tambahkan" : "Create New"}
              </h2>
            </Link>
          </div>
        </div>

        {/* customer search bar */}
        <div
          className={`table-div-custom p-6 my-4 md:mt-12 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <h1 className="text-lg md:text-xl mb-4">
            {theme.language === "Bahasa" ? "Bar Pencarian" : "Search Bar"}
          </h1>

          <div className="form-group">
            <div className="flex gap-2">
              <input
                autoComplete="off"
                type="text"
                className={`${
                  theme.dark
                    ? "!bg-dm_secondary text-neutral"
                    : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                } form-control block w-full md:w-[400px] px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                name="c_name"
                id="c_name"
                placeholder={
                  theme.language === "Bahasa"
                    ? "Masukkan Nama Pelanggan"
                    : "Enter Customer Name"
                }
                required
              />
              <button
                onClick={search}
                className={`w-fit button-custom mt-0 ${
                  theme.dark ? "bg-dm_secondary" : "bg-primary"
                }`}
              >
                {React.createElement(AiOutlineSearch, { size: "20" })}
              </button>
            </div>
          </div>
        </div>

        {/* customers table */}
        <div
          className={`table-div-custom p-6 my-4 md:mt-8 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <div className="flex justify-between">
            <h1 className="text-lg md:text-xl mb-4">
              {theme.language === "Bahasa"
                ? "Rincian Pelanggan"
                : "Customer Details"}
            </h1>
            {paginateCustomer && (
              <h2 className="text-sm hidden md:block">
                <span className="font-bold">Total: </span>
                {paginateCustomer.length}{" "}
                {theme.language === "Bahasa"
                  ? "Pelanggan"
                  : paginateCustomer.length > 1
                  ? "Customers"
                  : "Customer"}
              </h2>
            )}
          </div>

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

          {!loading && (!customers || customers.length == 0) && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">
                  {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
                </h3>
              </div>
            </div>
          )}

          {!loading && customers && customers.length != 0 && (
            <>
              {/* large screen view */}
              <div className="overflow-auto rounded-lg shadow hidden md:block">
                <table className="w-full">
                  <thead
                    className={`${
                      theme.dark ? "bg-primary" : "bg-gray-50 text-gray-700"
                    } border-b-2 border-gray-200`}
                  >
                    <tr>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa"
                          ? "Nomor Pelanggan"
                          : "Customer No."}
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa"
                          ? "Nama Pelanggan"
                          : "Customer Name"}
                      </th>
                      <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa"
                          ? "Nomor Tlp"
                          : "Phone No."}
                      </th>
                      <th className="w-64 p-3 text-sm font-semibold tracking-wide text-left">
                        Email
                      </th>
                      <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "Alamat" : "Address"}
                      </th>
                      <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "Keterangan" : "Remarks"}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginateCustomer &&
                      paginateCustomer.map((customer) => (
                        <tr
                          className={`${
                            theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                          } text-gray-700`}
                          key={customer._id}
                        >
                          <td className="p-3 text-sm text-primary font-bold whitespace-nowrap">
                            <Link
                              href={`/customers/${customer._id}`}
                              className="transition duration-700 hover:underline"
                            >
                              {customer._id}
                            </Link>
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {customer.name}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {customer.phone_no}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {customer.email.length > 25
                              ? customer.email.slice(0, 25) + " ..."
                              : customer.email}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {customer.address.length > 15
                              ? customer.address.slice(0, 15) + " ..."
                              : customer.address}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {customer.remarks
                              ? customer.remarks.length > 15
                                ? customer.remarks.slice(0, 15) + " ..."
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
              {paginateCustomer && (
                <h2 className="text-sm md:hidden mt-5 text-right">
                  <span className="font-bold">Total: </span>
                  {paginateCustomer.length}{" "}
                  {theme.language === "Bahasa"
                    ? "Pelanggan"
                    : paginateCustomer.length > 1
                    ? "Customers"
                    : "Customer"}
                </h2>
              )}
              <br className="md:hidden" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                {paginateCustomer &&
                  paginateCustomer.map((customer) => (
                    <div
                      className={`${
                        theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                      } text-gray-700 space-y-3 p-4 pb-6 rounded-lg shadow`}
                      key={customer._id}
                    >
                      <div className="text-sm font-medium break-words">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Nomor Pelanggan: "
                            : "Customer No: "}
                        </b>
                        <br />
                        {customer._id}
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa" ? "Nama: " : "Name: "}
                        </b>
                        {customer.name}
                      </div>
                      <hr />
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Nomor Tlp: "
                            : "Phone No: "}
                        </b>
                        {customer.phone_no}
                      </div>
                      <div className="text-sm font-medium">
                        <b>Email: </b>
                        <span className="text-sm font-medium">
                          {customer.email}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Alamat: "
                            : "Address: "}
                        </b>
                        {customer.address}
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Keterangan: "
                            : "Remarks: "}
                        </b>
                        {customer.remarks
                          ? customer.remarks.length > 20
                            ? customer.remarks.slice(0, 20) + " ..."
                            : customer.remarks
                          : "-"}
                      </div>

                      <div className="text-center pt-5">
                        <Link
                          className="py-2 px-5 text-xs font-medium uppercase tracking-wider rounded-md bg-tertiary text-white"
                          href={`/customers/${customer._id}`}
                        >
                          {theme.language === "Bahasa"
                            ? "Lihat Rincian"
                            : "View Details"}
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
    </LayoutIn>
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
