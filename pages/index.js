import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../context/ThemeContext";
import LayoutIn from "../layout/layoutIn";

import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlinePeopleAlt, MdMoneyOff } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { VscSignOut } from "react-icons/vsc";

export default function Home() {
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  const theme = useContext(ThemeContext);

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      {session
        ? session.group_code != ""
          ? User({ session })
          : UnapprovedUser({ session, handleSignOut })
        : Guest()}
    </div>
  );
}

// Guest Homepage
function Guest() {
  const theme = useContext(ThemeContext);

  return (
    <main className="container mx-auto text-center py-20">
      <h3 className="text-4xl font-bold">Use Login Page!</h3>

      <div className="flex justify-center">
        <Link
          href={"/login"}
          className="mt-5 px-10 py-1 rounded-sm bg-primary text-gray-50"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}

// Authorizes User Homepage
function User({ session }) {
  // theme
  const theme = useContext(ThemeContext);

  // initialize variables
  const [summary, setSummary] = useState();
  const [totalPaidInvoices, setTotalPaidInvoices] = useState();
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState();
  const [totalCustomers, setTotalCustomers] = useState();
  const [totalItems, setTotalItems] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [monthlyRevenue, setMonthlyRevenue] = useState();
  const [avgMonthlyRevenue, setAvgMonthlyRevenue] = useState();

  const [loading, setLoading] = useState(false);

  // fetch username
  const [username, setUsername] = useState();
  const getUsername = async () => {
    const res = await fetch(`http://localhost:3000/api/profile/${session._id}`);
    const profileObj = await res.json();
    const profileData = await profileObj.data;
    setUsername(profileData.username);
  };

  // fetch last 6 invoices
  const [invoices, setInvoices] = useState();
  const getInvoices = async () => {
    const res = await fetch(
      `http://localhost:3000/api/myinvoices/${session.group_code}`
    );
    const invoicesObj = await res.json();
    const invoicesData = await invoicesObj.data;
    if (invoicesData) {
      setInvoices(invoicesData.slice(0, 6));
    }
  };

  // fetch summary
  const getSummary = async () => {
    const res = await fetch(
      `http://localhost:3000/api/summary/${session.group_code}`
    );
    const summaryObj = await res.json();
    const summaryData = await summaryObj.data;
    setSummary(summaryData);
  };

  useEffect(() => {
    setLoading(true);
    getUsername();
    getSummary();
    getInvoices();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (summary) {
      setTotalPaidInvoices(summary.totalPaidInvoices);
      setTotalUnpaidInvoices(summary.totalUnpaidInvoices);
      setTotalCustomers(summary.totalCustomers);
      setTotalItems(summary.totalItems);
      setMonthlyRevenue(summary.monthlyRevenue.slice(0, 6));
      setAvgMonthlyRevenue(summary.avgMonthlyRevenue);

      // early month => no data
      if (summary.totalRevenue.length == 0) {
        setTotalRevenue(0);
      } else {
        setTotalRevenue(summary.totalRevenue[0].total);
      }
    }
  }, [summary]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return (
    <>
      <LayoutIn
        title={theme.language === "Bahasa" ? "Dasbor" : "Dashboard"}
        role={session.role}
      >
        <main className="container pt-[76px] pb-12 md:py-12 mx-8 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
            <h3 className="text-3xl md:text-4xl font-bold">
              {theme.language === "Bahasa" ? "Dasbor" : "Dashboard"}
            </h3>
            <hr className="md:hidden" />
          </div>

          {(loading || !summary) && (
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

          {!loading && summary && (
            <>
              {/* summary dashboard */}
              <div
                className={`table-div-custom p-6 my-4 md:my-12 md:mb-10 lg:mb-12 rounded-md ${
                  theme.dark ? "text-white !bg-dm_secondary" : ""
                }`}
              >
                <div className="flex justify-between flex-col gap-4 w-full mb-4">
                  <h1 className="text-lg md:text-xl">
                    {theme.language === "Bahasa" ? "Selamat Datang" : "Welcome"}
                    <b> {username}</b>!
                  </h1>
                  <hr className="md:hidden" />
                </div>

                <div className="flex flex-wrap mb-2">
                  <div className="w-full md:w-1/2 xl:w-1/3 pt-3 px-1 lg:px-3 md:pr-2">
                    <div className="flex justify-between bg-[#d27c0bd6] border rounded shadow p-2 overflow-hidden py-3">
                      <div className="dashboard-icon">
                        {React.createElement(GiTakeMyMoney, { size: "80" })}
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex-shrink pl-1 pr-4">
                          <i className="fa fa-wallet fa-2x fa-fw fa-inverse"></i>
                        </div>
                        <div className="flex-1 text-right">
                          <h5 className="text-white text-sm lg:text-base">
                            {theme.language === "Bahasa"
                              ? "Total Pendapatan"
                              : "Total Revenue"}
                          </h5>
                          <h3 className="text-white text-2xl lg:text-3xl">
                            {session &&
                              session.role == "admin" &&
                              (totalRevenue
                                ? totalRevenue.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                    currency: "IDR",
                                    style: "currency",
                                    currencyDisplay: "symbol",
                                  })
                                : "IDR -")}

                            {session &&
                              session.role == "staff" &&
                              "IDR XXX,XXX"}

                            <span className="text-green-400">
                              <i className="fas fa-caret-down"></i>
                            </span>
                          </h3>
                          <h3 className="text-white text-xs lg:text-sm">
                            {theme.language === "Bahasa"
                              ? "bulan ini"
                              : "this month"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 xl:w-1/3 pt-3 px-1 lg:px-3 md:pl-2">
                    <div className="flex justify-between bg-[#1E6A74] border rounded shadow p-2 overflow-hidden py-3">
                      <div className="dashboard-icon">
                        {React.createElement(MdOutlinePeopleAlt, {
                          size: "80",
                        })}
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex-shrink pl-1 pr-4">
                          <i className="fas fa-users fa-2x fa-fw fa-inverse"></i>
                        </div>
                        <div className="flex-1 text-right">
                          <h5 className="text-white text-sm lg:text-base">
                            {theme.language === "Bahasa"
                              ? "Pelanggan Terdaftar"
                              : "Registered Customers"}
                          </h5>
                          <h3 className="text-white text-2xl lg:text-3xl">
                            {session &&
                              session.role == "admin" &&
                              (totalCustomers ? totalCustomers : "-")}

                            {session && session.role == "staff" && "XXX"}

                            <span className="text-blue-400">
                              <i className="fas fa-caret-up"></i>
                            </span>
                          </h3>
                          <h3 className="text-white text-xs lg:text-sm">
                            {theme.language === "Bahasa"
                              ? "pelanggan"
                              : totalCustomers > 1
                              ? "customers"
                              : "customer"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 xl:w-1/3 pt-3 px-1 lg:px-3 md:pr-2 xl:pr-3 xl:pl-1">
                    <div className="flex justify-between bg-[#7B4B4E] border rounded shadow p-2 overflow-hidden py-3">
                      <div className="dashboard-icon">
                        {React.createElement(MdMoneyOff, { size: "80" })}
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex-shrink pl-1 pr-4">
                          <i className="fas fa-user-plus fa-2x fa-fw fa-inverse"></i>
                        </div>
                        <div className="flex-1 text-right pr-1">
                          <h5 className="text-white text-sm lg:text-base">
                            {theme.language === "Bahasa"
                              ? "Nota Belum Bayar"
                              : "Unpaid Invoices"}
                          </h5>
                          <h3 className="text-white text-2xl lg:text-3xl">
                            {session &&
                              session.role == "admin" &&
                              (totalUnpaidInvoices ? totalUnpaidInvoices : "-")}

                            {session && session.role == "staff" && "XXX"}

                            <span className="text-orange-400">
                              <i className="fas fa-caret-up"></i>
                            </span>
                          </h3>
                          <h3 className="text-white text-xs lg:text-sm">
                            {theme.language === "Bahasa"
                              ? "nota"
                              : totalUnpaidInvoices > 1
                              ? "invoices"
                              : "invoice"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 xl:w-1/3 pt-3 px-1 lg:px-3 md:pl-2 xl:pl-3 xl:pr-2">
                    <div className="flex justify-between bg-[#7D5878] border rounded shadow p-2 overflow-hidden py-3">
                      <div className="dashboard-icon">
                        {React.createElement(GoGraph, { size: "80" })}
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex-shrink pl-1 pr-4">
                          <i className="fas fa-server fa-2x fa-fw fa-inverse"></i>
                        </div>
                        <div className="flex-1 text-right">
                          <h5 className="text-white text-sm lg:text-base">
                            {theme.language === "Bahasa"
                              ? "Pendapatan Rata-rata"
                              : "Average Revenue"}
                          </h5>
                          <h3 className="text-white text-2xl lg:text-3xl">
                            {session &&
                              session.role == "admin" &&
                              (avgMonthlyRevenue
                                ? avgMonthlyRevenue.toLocaleString(undefined, {
                                    maximumFractionDigits: 0,
                                    currency: "IDR",
                                    style: "currency",
                                    currencyDisplay: "symbol",
                                  })
                                : "IDR -")}

                            {session &&
                              session.role == "staff" &&
                              "IDR XXX,XXX"}
                          </h3>
                          <h3 className="text-white text-xs lg:text-sm">
                            {theme.language === "Bahasa"
                              ? "per bulan"
                              : "monthly"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 xl:w-1/3 pt-3 px-1 lg:px-3 md:pr-2 xl:pl-2 xl:pr-3">
                    <div className="flex justify-between bg-[#8E7258] border rounded shadow p-2 overflow-hidden py-3">
                      <div className="dashboard-icon">
                        {React.createElement(BsBoxSeam, { size: "80" })}
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex-shrink pl-1 pr-4">
                          <i className="fas fa-tasks fa-2x fa-fw fa-inverse"></i>
                        </div>
                        <div className="flex-1 text-right">
                          <h5 className="text-white text-sm lg:text-base">
                            {theme.language === "Bahasa"
                              ? "Total Jenis Barang"
                              : "Total Items"}
                          </h5>
                          <h3 className="text-white text-2xl lg:text-3xl">
                            {session &&
                              session.role == "admin" &&
                              (totalItems ? totalItems : "-")}

                            {session && session.role == "staff" && "XXX"}
                          </h3>
                          <h3 className="text-white text-xs lg:text-sm">
                            {theme.language === "Bahasa"
                              ? "jenis"
                              : totalItems > 1
                              ? "items"
                              : "items"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 xl:w-1/3 pt-3 px-1 lg:px-3 md:pl-2 xl:pl-1">
                    <div className="flex justify-between bg-[#1B9287] border rounded shadow p-2 overflow-hidden py-3">
                      <div className="dashboard-icon">
                        {React.createElement(FaFileInvoiceDollar, {
                          size: "80",
                        })}
                      </div>

                      <div className="flex flex-row items-center">
                        <div className="flex-shrink pl-1 pr-4">
                          <i className="fas fa-inbox fa-2x fa-fw fa-inverse"></i>
                        </div>
                        <div className="flex-1 text-right">
                          <h5 className="text-white text-sm lg:text-base">
                            {theme.language === "Bahasa"
                              ? "Nota Sudah Bayar"
                              : "Paid Invoices"}
                          </h5>
                          <h3 className="text-white text-2xl lg:text-3xl">
                            {session &&
                              session.role == "admin" &&
                              (totalPaidInvoices ? totalPaidInvoices : "-")}

                            {session && session.role == "staff" && "XXX"}

                            <span className="text-pink-400">
                              <i className="fas fa-caret-up"></i>
                            </span>
                          </h3>
                          <h3 className="text-white text-xs lg:text-sm">
                            {theme.language === "Bahasa"
                              ? "nota"
                              : totalPaidInvoices > 1
                              ? "invoices"
                              : "invoice"}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {session && session.role == "staff" && (
                  <div>
                    <p className="mt-4 mx-4">
                      * ask admin for permission to access this data
                    </p>
                  </div>
                )}
              </div>

              {/* additional info */}
              <div className="flex flex-wrap lg:grid lg:grid-cols-12 md:gap-10 lg:gap-12 my-4 lg:mt-0">
                {/* left */}
                <div
                  className={`table-div-custom p-6 rounded-md col-span-7 w-full mb-4 md:mb-0 ${
                    theme.dark ? "text-white !bg-dm_secondary" : ""
                  }`}
                >
                  <div className="w-full mb-4">
                    <h1 className="text-lg md:text-xl">
                      {theme.language === "Bahasa"
                        ? "Nota Terbaru"
                        : "Latest Invoices"}
                    </h1>
                  </div>

                  <div>
                    {/* large screen view */}
                    {(!invoices || (invoices && invoices.length == 0)) && (
                      <p>[No Data]</p>
                    )}
                    {invoices && invoices.length > 0 && (
                      <div className="overflow-auto shadow hidden md:block">
                        <table className="w-full">
                          <thead
                            className={`${
                              theme.dark ? "!bg-primary" : "bg-gray-50"
                            } border-b-2 border-gray-200`}
                          >
                            <tr>
                              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
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
                                {theme.language === "Bahasa"
                                  ? "Tanggal"
                                  : "Date"}
                              </th>
                              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                                {theme.language === "Bahasa"
                                  ? "Pembayaran"
                                  : "Status"}
                              </th>
                              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-center">
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
                            {invoices.map((invoice) => (
                              <tr
                                className={`${
                                  theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                } text-gray-700`}
                                key={invoice._id}
                              >
                                <td className="p-3 text-sm text-primary font-bold whitespace-nowrap">
                                  <Link
                                    href={`/invoices/${invoice._id}`}
                                    className={`transition duration-700 hover:underline hidden lg:block text-primary`}
                                  >
                                    {invoice._id.length > 8
                                      ? invoice._id.slice(0, 8) + " ..."
                                      : invoice._id}
                                  </Link>

                                  <Link
                                    href={`/invoices/${invoice._id}`}
                                    className={`transition duration-700 hover:underline md:block lg:hidden ${
                                      theme.dark
                                        ? "text-neutral"
                                        : "text-primary"
                                    }`}
                                  >
                                    {invoice._id.length > 4
                                      ? invoice._id.slice(0, 4) + " ..."
                                      : invoice._id}
                                  </Link>
                                </td>
                                <td className="p-3 text-sm whitespace-nowrap hidden lg:block">
                                  {invoice.customer_name.length > 24
                                    ? invoice.customer_name.slice(0, 24) +
                                      " ..."
                                    : invoice.customer_name}{" "}
                                </td>
                                <td className="p-3 text-sm whitespace-nowrap md:block lg:hidden">
                                  {invoice.customer_name.length > 11
                                    ? invoice.customer_name.slice(0, 11) +
                                      " ..."
                                    : invoice.customer_name}{" "}
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
                                    {theme.language === "Bahasa"
                                      ? invoice.status === "paid"
                                        ? "sudah"
                                        : "belum"
                                      : invoice.status}
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
                    )}

                    {/* mobile view */}
                    <hr className="md:hidden" />
                    <br className="md:hidden" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                      {(!invoices || (invoices && invoices.length == 0)) && (
                        <p>[No Data]</p>
                      )}
                      {invoices &&
                        invoices.length > 0 &&
                        invoices.map((invoice) => (
                          <div
                            className={`space-y-3 p-4 pb-6 rounded-lg shadow ${
                              theme.dark
                                ? "bg-[#99AEBA] text-gray-700"
                                : "bg-white text-black"
                            }`}
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
                              </b>
                              {invoice.customer_name}
                            </div>
                            <hr />
                            <div className="text-sm font-medium">
                              <b>
                                {theme.language === "Bahasa"
                                  ? "Tanggal: "
                                  : "Date: "}
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

                    {invoices && invoices.length > 0 && (
                      <div className="mt-6 text-center">
                        <Link
                          className={`w-fit hover:underline hover:opacity-80 ${
                            theme.dark ? "text-white" : "text-primary"
                          }`}
                          href="/invoices"
                        >
                          <h2 className="whitespace-pre">
                            {theme.language === "Bahasa"
                              ? "Lihat Semua ..."
                              : "View More ..."}
                          </h2>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* right */}
                <div
                  className={`table-div-custom p-6 rounded-md col-span-5 w-full ${
                    theme.dark ? "text-white !bg-dm_secondary" : ""
                  }`}
                >
                  <div className="flex justify-between flex-col gap-4 w-full mb-4">
                    <h1 className="text-lg md:text-xl">
                      {theme.language === "Bahasa"
                        ? "Total Penjualan (6 Bulan Terakhir)"
                        : "Total Sales (Last 6 Months)"}
                    </h1>
                    <hr className="md:hidden" />
                  </div>

                  <div>
                    {monthlyRevenue && monthlyRevenue.length == 0 && (
                      <p>[No Data]</p>
                    )}

                    {session && session.role == "staff" && (
                      <p className="my-6">
                        * ask admin for permission to access this data
                      </p>
                    )}

                    <div className="flex flex-wrap mb-2">
                      {session &&
                        session.role == "admin" &&
                        monthlyRevenue &&
                        monthlyRevenue.map((mr) => (
                          <div
                            key={mr._id}
                            className="w-full md:w-1/2 pt-3 px-1"
                          >
                            <div className="flex border rounded shadow p-2 overflow-hidden py-3 overflow-x-auto">
                              <div
                                className={`bg-primary w-[18px] rounded md:hidden`}
                              ></div>
                              <div className="flex-1 text-right">
                                <h5 className="text-sm md:text-base break-words">
                                  {theme.language === "Bahasa"
                                    ? bulan[mr.month - 1]
                                    : months[mr.month - 1]}
                                  &nbsp;{mr.year}
                                </h5>
                                <h3 className="text-xl md:text-2xl break-words">
                                  {mr.average
                                    ? mr.average.toLocaleString(undefined, {
                                        maximumFractionDigits: 0,
                                        currency: "IDR",
                                        style: "currency",
                                        currencyDisplay: "symbol",
                                      })
                                    : "IDR -"}
                                  <span className="text-green-400">
                                    <i className="fas fa-caret-down"></i>
                                  </span>
                                </h3>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </LayoutIn>
    </>
  );
}

// UnApproved Staff Homepage
function UnapprovedUser({ session, handleSignOut }) {
  // theme
  const theme = useContext(ThemeContext);

  const [cc, setCC] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // if user is waiting for approval: get company info that they are applying for
  const getCC = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/applicant/${session._id}`
    );
    const ccObj = await res.json();
    const ccData = ccObj.data;
    setCC(ccData);
    setLoading(false);
  };

  useEffect(() => {
    getCC();
  }, []);

  // when data changes
  const [data, setData] = useState();
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };

  // function to display 'delete confirmation' dialog
  function showModalDeleteConfirmation() {
    document.getElementById("modalDeleteConfirmation").style.display = "block";
  }

  // function to display 'make a request' dialog
  function showModalReqCC() {
    document.getElementById("modalNewReq").style.display = "block";
  }

  // function to cancel 'delete account'
  const cancelDeleteAccount = (e) => {
    e.preventDefault();
    document.getElementById("modalDeleteConfirmation").style.display = "none";
  };

  // function to cancel 'make a request'
  const cancelCCReq = (e) => {
    e.preventDefault();
    document.getElementById("modalNewReq").style.display = "none";
  };

  // function to delete an account
  const deleteAccount = (e) => {
    e.preventDefault();
    document.getElementById("modalDeleteConfirmation").style.display = "none";

    fetch(`http://localhost:3000/api/profile/${session._id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        handleSignOut();
      } else {
        setErrorMsg("Failed to Delete an Account! Try Again!");
      }
    });
  };

  // function to make request
  const reqCC = async (e) => {
    e.preventDefault();
    document.getElementById("modalNewReq").style.display = "none";

    if (!data || !data.code) {
      setErrorMsg("Code cannot be empty!");
      return false;
    }

    let obj;
    // if user enter company code
    if (data.code) {
      // check if company code is valid
      const res = await fetch(
        `http://localhost:3000/api/validateGroup/${data.code}`
      );
      obj = await res.json();
    }

    // if company code is valid or if user do not enter company code
    if (obj && obj.result) {
      var jsonData = {
        group_code: data.code,
        applicantId: session._id,
      };

      fetch(`http://localhost:3000/api/approval/${data.code}`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(jsonData),
      }).then((response) => {
        if (response.status === 200) {
          document.getElementById("modalSucessReq").style.display = "block";
        } else {
          setErrorMsg("Failed to Make Request! Try Again!");
        }
      });
    } else {
      setErrorMsg("Invalid Company Code!");
    }
  };

  return (
    <LayoutIn
      title={theme.language === "Bahasa" ? "Dasbor" : "Dashboard"}
      role={session.role}
    >
      <main className="py-12 mx-10 md:mx-14">
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
          <h3 className="text-3xl md:text-4xl font-bold">
            {theme.language === "Bahasa" ? "Dasbor" : "Dashboard"}
          </h3>
          <hr className="md:hidden" />
          <div>
            <button
              onClick={handleSignOut}
              className="w-fit group flex items-center text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
            >
              <div>{React.createElement(VscSignOut, { size: "12" })}</div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Keluar" : "Sign Out"}
              </h2>
            </button>
          </div>
        </div>

        {/* error msg */}
        {errorMsg != "" && (
          <div
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 md:mt-8"
            role="alert"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              dataprefix="fas"
              icon="times-circle"
              className="w-4 h-4 mr-2 fill-current"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
              ></path>
            </svg>
            {errorMsg}

            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMsg("")}
            >
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>{theme.language === "Bahasa" ? "Tutup" : "Close"}</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        )}

        {/* modal del acc */}
        <div className="hidden" id="modalDeleteConfirmation">
          <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
            <div className="bg-white px-10 py-8 rounded-md text-center">
              <h1 className="text-xl mb-6 font-bold">
                {theme.language === "Bahasa"
                  ? "Apakah Kamu Yakin Mau Menghapus Akun?"
                  : "Do you Want Delete Account?"}
              </h1>
              <button
                className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                onClick={cancelDeleteAccount}
              >
                {theme.language === "Bahasa" ? "Tidak" : "No"}
              </button>
              <button
                className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                onClick={deleteAccount}
              >
                {theme.language === "Bahasa" ? "Ya" : "Yes"}
              </button>
            </div>
          </div>
        </div>

        {/* modal new req */}
        <div className="hidden" id="modalNewReq">
          <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0 z-99">
            <div className="bg-white px-10 py-8 rounded-md text-center">
              <h1 className="text-xl mb-6 font-bold">
                {theme.language === "Bahasa"
                  ? "Masukkan Kode Perusahaan:"
                  : "Enter Company Code:"}
              </h1>
              <input
                autoComplete="off"
                type="text"
                className={`${
                  theme.dark
                    ? "!bg-dm_secondary text-neutral"
                    : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                } form-control text-center block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                name="code"
                id="code"
                onChange={handleChange}
                required
              />

              <div className="mt-10">
                <button
                  className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                  onClick={cancelCCReq}
                >
                  {theme.language === "Bahasa" ? "Batal" : "Cancel"}
                </button>
                <button
                  className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                  onClick={reqCC}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* modal success req */}
        <div className="hidden" id="modalSucessReq">
          <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
            <div className="bg-white px-10 py-8 rounded-md text-center">
              <h1 className="text-xl mb-6 font-bold">
                {theme.language === "Bahasa"
                  ? "Permintaan Telah Berhasil dibuat. Masuk Ulang!"
                  : "Request is Sucessfully made. Sign In Again!"}
              </h1>

              <div className="mt-10">
                <button
                  className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                  onClick={handleSignOut}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`table-div-custom p-6 my-4  ${
            errorMsg ? "md:my-8" : "md:my-12 md:mb-10"
          } lg:mb-12 rounded-md ${
            theme.dark ? "text-white !bg-dm_secondary" : ""
          }`}
        >
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

          {!loading &&
            (!cc ? (
              <div>
                <h1 className="text-xl">
                  Your request or permission for company code has been expired!
                </h1>

                <div className="flex gap-4 mt-12">
                  <button
                    onClick={showModalReqCC}
                    className="w-fit group flex items-center text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
                  >
                    New Request
                  </button>
                  <button
                    onClick={showModalDeleteConfirmation}
                    className="w-fit group flex items-center text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-[#F44645] text-white hover:opacity-80 transition duration-700 rounded-md"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-xl">
                  Your request is currently being processed!
                </h1>
                <br />
                <div>
                  <p className="text-xl mb-2">Request Info</p>
                  <hr />
                  <p className="mt-4">
                    Company Code: {cc && cc.groupId && cc.groupId.group_code}
                  </p>
                </div>

                <div className="mt-20">
                  <button
                    onClick={showModalDeleteConfirmation}
                    className="w-fit group flex items-center text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-[#F44645] text-white hover:opacity-80 transition duration-700 rounded-md"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </LayoutIn>
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
