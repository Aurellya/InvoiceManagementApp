import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../../context/ThemeContext";
import LayoutIn from "../../layout/layoutIn";

import { AiFillEdit, AiFillDelete, AiFillPrinter } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";

import ReactToPrint from "react-to-print";
import ComponentToPrint from "../../components/ComponentToPrint";

const Invoice = () => {
  // session
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // ref
  const componentRef = useRef();

  // fetch data
  const [invoice, setInvoice] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const getInvoice = async () => {
    setLoading(true);

    // Get ID from URL
    const { id } = router.query;
    // get invoices data from the database
    const res = await fetch(`/api/invoices/${id}`);
    const invoiceObj = await res.json();
    const invoice = invoiceObj.data;

    setInvoice(invoice);
    setLoading(false);
  };

  useEffect(() => {
    getInvoice();
  }, []);

  // function to display delete confirmation dialog
  function showModalDeleteConfirmation() {
    document.getElementById("modal").style.display = "block";
  }

  const cancelDeleteInvoice = (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";
  };

  // function to delete a particular Invoice
  const deleteInvoice = (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";

    // Send data to the backend via POST
    fetch(`/api/invoices/${invoice._id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = `/invoices`;
      } else {
        setErrorMsg("Failed to Delete Invoice! Try Again!");
      }
    });
  };

  return (
    <LayoutIn
      title={theme.language === "Bahasa" ? "Rincian Nota" : "Invoice Details"}
      role={session.role}
    >
      <main className="pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full max-w-[1536px]">
        {/* header section */}
        <div className="flex md:items-center justify-between w-full mb-6 md:mb-12">
          <div className="flex items-center gap-8">
            <Link
              className={`${
                theme.dark ? "bg-dm_secondary" : "bg-primary"
              } group flex items-center text-sm font-bold gap-2 py-2 px-4 text-white hover:opacity-80 transition duration-700 rounded-md`}
              href="/invoices"
            >
              <div>
                {React.createElement(IoArrowBackOutline, { size: "12" })}
              </div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Kembali" : "Back"}
              </h2>
            </Link>
            <h3 className="text-3xl md:text-4xl font-bold">
              {theme.language === "Bahasa" ? "Nota" : "Invoice"}
            </h3>
          </div>

          <hr className="md:hidden mb-2" />

          {/* btn group: for large screen view */}
          <div className="items-center gap-2 hidden md:flex">
            <div>
              <ReactToPrint
                trigger={() => (
                  <button className="group button-custom bg-tertiary">
                    <div>
                      {React.createElement(AiFillPrinter, { size: "12" })}
                    </div>
                    <h2 className="whitespace-pre">
                      {theme.language === "Bahasa"
                        ? "Cetak Nota"
                        : "Print Invoice"}
                    </h2>
                  </button>
                )}
                content={() => componentRef.current}
              />
              <div className="hidden">
                {!loading && invoice && (
                  <ComponentToPrint
                    ref={componentRef}
                    invoice={invoice}
                    theme={theme}
                  />
                )}
              </div>
            </div>
            {session && session.role == "admin" && (
              <>
                <Link
                  className={`${
                    theme.dark ? "bg-dm_secondary" : "bg-primary"
                  } group button-custom`}
                  href={`/editInvoice/${router.query.id}`}
                >
                  <div>{React.createElement(AiFillEdit, { size: "12" })}</div>
                  <h2 className="whitespace-pre">Edit</h2>
                </Link>

                <button
                  className="group button-custom bg-[#F44645]"
                  onClick={showModalDeleteConfirmation}
                >
                  <div>{React.createElement(AiFillDelete, { size: "12" })}</div>
                  <h2 className="whitespace-pre">
                    {theme.language === "Bahasa" ? "Hapus" : "Delete"}
                  </h2>
                </button>
              </>
            )}
          </div>
        </div>

        {/* modal */}
        <div className="hidden" id="modal">
          <div
            className={`${
              theme.dark ? "bg-slate-200" : "bg-slate-800"
            } bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0`}
          >
            <div
              className={`${
                theme.dark ? "bg-primary border border-neutral" : "bg-white"
              } px-10 py-8 rounded-md text-center`}
            >
              <h1 className="text-xl mb-6 font-bold">
                {theme.language === "Bahasa"
                  ? "Apakah Kamu Yakin Mau Menghapus Nota?"
                  : "Do you Want Delete?"}
              </h1>
              <button
                className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                onClick={cancelDeleteInvoice}
              >
                {theme.language === "Bahasa" ? "Batal" : "Cancel"}
              </button>
              <button
                className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                onClick={deleteInvoice}
              >
                Ok
              </button>
            </div>
          </div>
        </div>

        {/* error msg */}
        {errorMsg != "" && (
          <div
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 md:my:0"
            role="alert"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              dataprefix="fas"
              dataicon="times-circle"
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

        {/* contents */}
        <div
          className={`table-div-custom my-4 md:my-0 p-6 block mb-4 md:mb-0 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <div>
            <h1 className="text-lg md:text-xl mb-3">
              {theme.language === "Bahasa" ? "Rincian Nota" : "Invoice Details"}
            </h1>
          </div>

          <hr />
          <br />

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

          {!loading && !invoice && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">
                  {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
                </h3>
              </div>
            </div>
          )}

          {/* invoice details*/}
          {!loading && invoice && (
            <div className="overflow-auto flex gap-10 flex-col md:grid md:grid-cols-12">
              {/* left */}
              <div
                className={`${
                  theme.dark ? "text-neutral !bg-dm_secondary" : "bg-neutral"
                } md:max-w-[450px] md:mt-2 md:col-span-5 w-full p-6 border h-fit`}
              >
                <div className="md:flex md:justify-between md:flex-wrap md:w-full text-sm font-medium md:text-base">
                  <div>
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Nomor Nota: "
                          : "Invoice No: "}
                      </b>
                    </p>
                    <p className="break-all">{invoice._id}</p>
                    <br />
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Nama Pelanggan: "
                          : "Customer Name: "}
                      </b>
                    </p>
                    <p>{invoice.customer_name}</p> <br />
                  </div>

                  <div>
                    <p>
                      <b>
                        {theme.language === "Bahasa" ? "Tanggal: " : "Date: "}
                      </b>
                    </p>
                    <p>{invoice.date.substring(0, 10)}</p>
                    <br />
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Pembayaran: "
                          : "Status: "}
                      </b>
                    </p>
                    <p>
                      {theme.language === "Bahasa"
                        ? invoice.status === "paid"
                          ? "sudah"
                          : "belum"
                        : invoice.status}
                    </p>
                    <br />
                  </div>
                </div>

                <div className="text-sm font-medium md:text-base">
                  <p>
                    <b>
                      {theme.language === "Bahasa" ? "Catatan: " : "Notes: "}
                    </b>
                  </p>
                  <p>{invoice.notes === "" ? "-" : invoice.notes}</p>
                </div>
              </div>

              {/* btn group: for mobile view */}
              <div className="grid grid-cols-7 gap-2 md:hidden">
                <div className="col-span-4">
                  <ReactToPrint
                    trigger={() => (
                      <button className="group button-custom bg-tertiary">
                        <div>
                          {React.createElement(AiFillPrinter, { size: "12" })}
                        </div>
                        <h2 className="whitespace-pre">
                          {theme.language === "Bahasa"
                            ? "Cetak Nota"
                            : "Print Invoice"}
                        </h2>
                      </button>
                    )}
                    content={() => componentRef.current}
                  />
                  <div className="hidden">
                    {!loading && invoice && (
                      <ComponentToPrint
                        ref={componentRef}
                        invoice={invoice}
                        theme={theme}
                      />
                    )}
                  </div>
                </div>

                {session && session.role == "admin" && (
                  <>
                    <Link
                      className={`bg-primary group button-custom col-span-3`}
                      href={`/editInvoice/${router.query.id}`}
                    >
                      <div>
                        {React.createElement(AiFillEdit, { size: "12" })}
                      </div>
                      <h2 className="whitespace-pre">Edit</h2>
                    </Link>
                    <div className="col-span-4"></div>
                    <button
                      className="group button-custom bg-[#F44645] col-span-3"
                      onClick={showModalDeleteConfirmation}
                    >
                      <div>
                        {React.createElement(AiFillDelete, { size: "12" })}
                      </div>
                      <h2 className="whitespace-pre">
                        {theme.language === "Bahasa" ? "Hapus" : "Delete"}
                      </h2>
                    </button>
                  </>
                )}
              </div>

              {/* right */}
              <div
                className={`w-full md:w-fit md:col-span-7 mt-1 md:mt-[-15px] ${
                  theme.dark ? "text-neutral" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4 md:mt-4">
                  <h1 className="text-lg md:hidden">
                    {theme.language === "Bahasa" ? "Barang" : "Items"}
                  </h1>
                  <h1></h1>
                  <div className="flex md:items-center justify-between flex-col md:flex-row md:gap-10 text-sm">
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Jumlah Barang: "
                          : "Total Items: "}
                      </b>
                      {invoice.total_items ? invoice.total_items : "-"}
                    </p>
                    <p>
                      <b>Total: </b>
                      {invoice.total
                        ? invoice.total.toLocaleString("en-US", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })
                        : "-"}
                    </p>
                  </div>
                </div>

                {/* table: for large screen view */}
                <div className="overflow-auto rounded-lg shadow hidden md:block">
                  <table className="w-full">
                    <thead
                      className={`${
                        theme.dark ? "bg-primary" : "bg-gray-50"
                      } border-b-2 border-gray-200`}
                    >
                      <tr>
                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          {theme.language === "Bahasa" ? "Jumlah" : "Quantity"}
                        </th>
                        <th className="w-96 p-3 text-sm font-semibold tracking-wide text-left">
                          {theme.language === "Bahasa"
                            ? "Nama Barang"
                            : "Item Name"}
                        </th>
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                          {theme.language === "Bahasa"
                            ? "Harga (/Unit)"
                            : "Price (/Unit)"}
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {invoice.contents.map((content, i) => (
                        <tr
                          className={`${
                            theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                          } text-gray-700`}
                          key={invoice._id + "-" + i}
                        >
                          <td className="p-3 text-sm whitespace-nowrap">
                            {content.amount + " "}
                            {theme.language === "Bahasa"
                              ? content.unit
                              : content.unit == "bh"
                              ? "pcs"
                              : content.unit == "ls"
                              ? "doz"
                              : content.unit == "grs"
                              ? "gro"
                              : "box"}
                          </td>
                          <td className="p-3 text-sm break-word">
                            {/* {content.item_name
                              ? content.item_name.length > 50
                                ? content.item_name.slice(0, 50) + " ..."
                                : content.item_name
                              : "-"} */}
                            {content.item_name}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {content.price_per_item.toLocaleString("en-US", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            })}{" "}
                            /
                            {theme.language === "Bahasa"
                              ? content.price_unit
                              : content.price_unit == "bh"
                              ? "pcs"
                              : content.price_unit == "ls"
                              ? "doz"
                              : content.price_unit == "grs"
                              ? "gro"
                              : "box"}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {content.total.toLocaleString("en-US", {
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

                {/* table: for mobile view */}
                <hr className="md:hidden" />
                <br className="md:hidden" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                  {invoice.contents.map((content, i) => (
                    <div
                      className={`${
                        theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                      } text-gray-700 space-y-3 p-4 rounded-lg shadow`}
                      key={"mobile-" + invoice._id + "-" + i}
                    >
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Jumlah: "
                            : "Quantity: "}
                        </b>
                        {content.amount + " "}
                        {theme.language === "Bahasa"
                          ? content.unit
                          : content.unit == "bh"
                          ? "pcs"
                          : content.unit == "ls"
                          ? "doz"
                          : content.unit == "grs"
                          ? "gro"
                          : "box"}
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Nama Barang: "
                            : "Item Name: "}
                        </b>
                        {content.item_name}
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Harga (/Unit): "
                            : "Price (/Unit): "}
                        </b>
                        {content.price_per_item.toLocaleString("en-US", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        })}{" "}
                        /{content.price_unit}
                      </div>
                      <div className="text-sm font-medium">
                        <b>Total: </b>
                        {content.total.toLocaleString("en-US", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </LayoutIn>
  );
};

export default Invoice;

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
