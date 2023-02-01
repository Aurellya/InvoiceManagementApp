import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import { ThemeContext } from "../context/ThemeContext";

import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlinePeopleAlt, MdMoneyOff } from "react-icons/md";
import { BsBoxSeam, BsPlusLg } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { GoGraph } from "react-icons/go";

import ReactLoading from "react-loading";

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

      {session ? User({ session, handleSignOut }) : Guest()}
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
function User({ session, handleSignOut }) {
  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [summary, setSummary] = useState();
  const [totalPaidInvoices, setTotalPaidInvoices] = useState();
  const [totalUnpaidInvoices, setTotalUnpaidInvoices] = useState();
  const [totalCustomers, setTotalCustomers] = useState();
  const [totalItems, setTotalItems] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [monthlyRevenue, setMonthlyRevenue] = useState();
  const [avgMonthlyRevenue, setAvgMonthlyRevenue] = useState();

  const [invoices, setInvoices] = useState();

  const [loading, setLoading] = useState(false);

  const getInvoices = async () => {
    const res = await fetch(
      `http://localhost:3000/api/myinvoices/${session.group_code}`
    );
    const invoicesObj = await res.json();
    const invoices = await invoicesObj.data;
    setInvoices(invoices.slice(0, 6));
  };

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
      <Head>
        <title>{theme.language === "Bahasa" ? "Dasbor" : "Dashboard"}</title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
            <h3 className="text-3xl md:text-4xl font-bold">
              {theme.language === "Bahasa" ? "Dasbor" : "Dashboard"}
            </h3>
            <hr className="md:hidden" />
          </div>

          {loading ||
            !summary ||
            !invoices ||
            (!monthlyRevenue && (
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
            ))}

          {!loading && invoices && summary && monthlyRevenue && (
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
                    <b> {session.username}</b>!
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
                            {totalRevenue
                              ? totalRevenue.toLocaleString(undefined, {
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
                            {totalCustomers ? totalCustomers : "-"}{" "}
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
                            {totalUnpaidInvoices ? totalUnpaidInvoices : "-"}{" "}
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
                            {avgMonthlyRevenue
                              ? avgMonthlyRevenue.toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                  currency: "IDR",
                                  style: "currency",
                                  currencyDisplay: "symbol",
                                })
                              : "IDR -"}
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
                            {totalItems ? totalItems : "-"}
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
                            {totalPaidInvoices ? totalPaidInvoices : "-"}{" "}
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
              </div>

              {/* additional info */}
              <div className="flex flex-wrap lg:grid lg:grid-cols-12 md:gap-10 lg:gap-14 my-4 lg:mt-0 lg:mb-12">
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
                              {theme.language === "Bahasa" ? "Tanggal" : "Date"}
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
                                    theme.dark ? "text-neutral" : "text-primary"
                                  }`}
                                >
                                  {invoice._id.length > 4
                                    ? invoice._id.slice(0, 4) + " ..."
                                    : invoice._id}
                                </Link>
                              </td>
                              <td className="p-3 text-sm whitespace-nowrap hidden lg:block">
                                {invoice.customer_name.length > 24
                                  ? invoice.customer_name.slice(0, 24) + " ..."
                                  : invoice.customer_name}{" "}
                              </td>
                              <td className="p-3 text-sm whitespace-nowrap md:block lg:hidden">
                                {invoice.customer_name.length > 11
                                  ? invoice.customer_name.slice(0, 11) + " ..."
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

                    {/* mobile view */}
                    <hr className="md:hidden" />
                    <br className="md:hidden" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                      {invoices.map((invoice) => (
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
                    <div className="flex flex-wrap mb-2">
                      {monthlyRevenue.map((mr) => (
                        <div
                          key={mr._id}
                          className="w-full md:w-1/2 xl:w-1/2 pt-3 px-1 lg:px-2"
                        >
                          <div className="flex border rounded shadow p-2 overflow-hidden py-3">
                            <div
                              className={`bg-primary w-[18px] rounded md:hidden`}
                            ></div>
                            <div className="flex-1 text-right">
                              <h5 className="text-sm md:text-base">
                                {theme.language === "Bahasa"
                                  ? bulan[mr.month - 1]
                                  : months[mr.month - 1]}
                                &nbsp;{mr.year}
                              </h5>
                              <h3 className="text-xl md:text-2xl">
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
