import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../context/ThemeContext";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";
import LayoutIn from "../layout/layoutIn";

import { BsPlusLg } from "react-icons/bs";

export default () => {
  // session
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [invoices, setInvoices] = useState();
  const [loading, setLoading] = useState(false);

  const getInvoices = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/myinvoices/${session.group_code}`
    );
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
    <LayoutIn
      title={theme.language === "Bahasa" ? "Nota" : "Invoices"}
      role={session.role}
    >
      <main
        className={`pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full ${
          loading || (!loading && (!invoices || invoices.length == 0))
            ? "md:w-full"
            : "md:w-auto"
        } lg:w-full max-w-[1536px]`}
      >
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
          <h3 className="text-3xl md:text-4xl font-bold">
            {theme.language === "Bahasa" ? "Nota" : "Invoices"}
          </h3>
          <hr className="md:hidden" />
          <div className="flex justify-end">
            <Link
              className={`w-fit button-custom mt-0 ${
                theme.dark ? "bg-dm_secondary" : "bg-primary"
              }`}
              href="/addInvoice"
            >
              <div>{React.createElement(BsPlusLg, { size: "12" })}</div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Buat Nota" : "Create New"}
              </h2>
            </Link>
          </div>
        </div>

        {/* invoices table */}
        <div
          className={`table-div-custom p-6 my-4 md:mt-12 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <div className="flex justify-between">
            <h1 className="text-lg md:text-xl mb-4">
              {theme.language === "Bahasa" ? "Nota Terbaru" : "Recent Invoices"}
            </h1>
            {invoices && (
              <h2 className="text-sm hidden md:block">
                <span className="font-bold">Total: </span>
                {invoices.length}{" "}
                {theme.language === "Bahasa"
                  ? "Nota"
                  : invoices.length > 1
                  ? "Invoices"
                  : "Invoice"}
              </h2>
            )}
          </div>

          {loading && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">
                  {theme.language === "Bahasa" ? "Memuat" : "Loading"}
                </h3>
                {theme.dark ? (
                  <ReactLoading
                    type="bars"
                    color="#F4F5F9"
                    height={100}
                    width={50}
                  />
                ) : (
                  <ReactLoading
                    type="bars"
                    color="#2b4450"
                    height={100}
                    width={50}
                  />
                )}
              </div>
            </div>
          )}

          {!loading && (!invoices || invoices.length == 0) && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">
                  {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
                </h3>
              </div>
            </div>
          )}

          {!loading && invoices && invoices.length != 0 && (
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
                          ? "Nomor Nota"
                          : "Invoice No."}
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa"
                          ? "Nama Pelanggan"
                          : "Customer Name"}
                      </th>
                      <th className="w-38 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "Tanggal" : "Date"}
                      </th>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "Pembayaran" : "Status"}
                      </th>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-center">
                        {theme.language === "Bahasa"
                          ? "Jumlah Barang"
                          : "Total Items"}
                      </th>
                      <th className="w-38 p-3 text-sm font-semibold tracking-wide text-left">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginateInvoice.map((invoice) => (
                      <tr
                        className={`${
                          theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                        } text-gray-700`}
                        key={invoice._id}
                      >
                        <td
                          className={`p-3 text-sm font-bold whitespace-nowrap text-primary`}
                        >
                          <Link
                            href={`/invoices/${invoice._id}`}
                            className="transition duration-700 hover:underline"
                          >
                            {invoice._id}
                          </Link>
                        </td>
                        <td className="p-3 text-sm whitespace-nowrap">
                          {invoice.customer_name}
                        </td>
                        <td className="p-3 text-sm whitespace-nowrap">
                          {invoice.date.substring(0, 10)}
                        </td>
                        <td className="p-3 text-sm whitespace-nowrap">
                          <span
                            className={`p-1.5 text-xs font-medium uppercase tracking-wider ${
                              invoice.status === "paid"
                                ? "text-green-800 bg-[#74EAB0]"
                                : "text-gray-800 bg-gray-200"
                            }  rounded-lg bg-opacity-50`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm whitespace-nowrap text-center">
                          {invoice.total_items}
                        </td>
                        <td className="p-3 text-sm whitespace-nowrap">
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
              {invoices && (
                <h2 className="text-sm md:hidden mt-5 text-right">
                  <span className="font-bold">Total: </span>
                  {invoices.length}{" "}
                  {theme.language === "Bahasa"
                    ? "Nota"
                    : invoices.length > 1
                    ? "Invoices"
                    : "Invoice"}
                </h2>
              )}
              <br className="md:hidden" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                {paginateInvoice.map((invoice) => (
                  <div
                    className={`${
                      theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                    } text-gray-700 space-y-3 p-4 pb-6 rounded-lg shadow`}
                    key={invoice._id}
                  >
                    <div className="text-sm font-medium break-words">
                      <b>
                        {theme.language === "Bahasa"
                          ? "Nomor Nota:"
                          : "Invoice No:"}
                      </b>
                      <br />
                      {invoice._id}
                    </div>
                    <div className="text-sm font-medium">
                      <b>
                        {theme.language === "Bahasa"
                          ? "Pelanggan: "
                          : "Customer: "}
                      </b>{" "}
                      {invoice.customer_name}
                    </div>
                    <hr />
                    <div className="text-sm font-medium">
                      <b>
                        {theme.language === "Bahasa" ? "Tanggal: " : "Date: "}
                      </b>
                      {invoice.date.substring(0, 10)}
                    </div>
                    <div className="text-sm font-medium">
                      <b>
                        {theme.language === "Bahasa"
                          ? "Pembayaran:"
                          : "Status:"}
                      </b>{" "}
                      &nbsp;
                      <span
                        className={`p-1.5 text-xs font-medium uppercase tracking-wider ${
                          invoice.status === "paid"
                            ? "text-green-800 bg-[#74EAB0]"
                            : "text-gray-800 bg-gray-200"
                        } rounded-lg bg-opacity-50`}
                      >
                        {theme.language === "Bahasa"
                          ? invoice.status === "paid"
                            ? "sudah"
                            : "belum"
                          : invoice.status}
                      </span>
                    </div>
                    <div className="text-sm font-medium">
                      <b>
                        {theme.language === "Bahasa"
                          ? "Jumlah Barang: "
                          : "Total Items: "}
                      </b>
                      {invoice.total_items}
                    </div>
                    <div className="text-sm font-medium">
                      <b>
                        {theme.language === "Bahasa"
                          ? "Total Pembayaran: "
                          : "Total Cost: "}
                      </b>
                      {invoice.total.toLocaleString("en-US", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      })}
                    </div>

                    <div className="text-center pt-5">
                      <Link
                        className="py-2 px-5 text-xs font-medium uppercase tracking-wider rounded-md bg-complementary text-white"
                        href={`/invoices/${invoice._id}`}
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
                items={invoices.length}
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
