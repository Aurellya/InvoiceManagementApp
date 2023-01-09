import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, useSession, signOut } from "next-auth/react";

import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";

import { AiFillEdit, AiFillDelete, AiFillPrinter } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";

import ReactLoading from "react-loading";

export default function Invoice() {
  // session
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  // theme
  const theme = useContext(ThemeContext);

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
    const res = await fetch(`http://localhost:3000/api/invoices/${id}`);
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
    fetch(`http://localhost:3000/api/invoices/${invoice._id}`, {
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
    <section className="flex">
      <Sidebar handleSignOut={handleSignOut} />

      <main className="container py-12 mx-10 md:mx-14">
        {/* header section */}
        <div className="flex md:items-center justify-between mb-10">
          <div className="flex items-center gap-8">
            <Link className="group button-custom bg-[#0E3658]" href="/invoices">
              <div>
                {React.createElement(IoArrowBackOutline, { size: "12" })}
              </div>
              <h2 className="whitespace-pre">Back</h2>
            </Link>
            <h3 className="text-3xl md:text-4xl font-bold">Invoice</h3>
          </div>

          {/* large screen view - btn group */}
          <div className="items-center gap-2 hidden md:flex">
            <button className="group button-custom bg-[#246A3D]">
              <div>{React.createElement(AiFillPrinter, { size: "12" })}</div>
              <h2 className="whitespace-pre">Print Invoice</h2>
            </button>
            <Link
              className="group button-custom bg-[#0E3658]"
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
              <h2 className="whitespace-pre">Delete</h2>
            </button>
          </div>
        </div>

        {/* Modal */}
        <div className="hidden" id="modal">
          <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div className="bg-white px-10 py-8 rounded-md text-center">
              <h1 className="text-xl mb-6 font-bold">Do you Want Delete?</h1>
              <button
                className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                onClick={cancelDeleteInvoice}
              >
                Cancel
              </button>
              <button
                className="bg-[#246A3D] px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
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
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <svg
              ariaHidden="true"
              focusable="false"
              dataPrefix="fas"
              dataIcon="times-circle"
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
              class="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMsg("")}
            >
              <svg
                class="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        )}

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

        {!loading && !invoice && (
          <div className="py-8">
            <div className="mt-9 flex flex-col justify-center items-center">
              <h3 className="text-xl mb-4 font-bold">No Data</h3>
            </div>
          </div>
        )}

        {!loading && invoice && (
          <div className="mb-10 flex gap-0 md:gap-16 flex-col md:flex-row">
            {/* details section*/}
            <div className="md:p-4 w-full md:w-fit">
              <div className="">
                <h2 className="text-lg md:text-xl mb-3">Details</h2>
              </div>

              <hr />
              <br />

              <div className="md:flex gap-20 text-sm font-medium md:text-base whitespace-nowrap">
                <div>
                  <p>
                    <b>Invoice Id: </b>
                  </p>
                  <p>{invoice._id}</p>
                  <br />
                  <p>
                    <b>Customer Name: </b>
                  </p>
                  <p>{invoice.customer_name}</p> <br />
                </div>

                <div>
                  <p>
                    <b>Date: </b>
                  </p>
                  <p>{invoice.date.substring(0, 10)}</p>
                  <br />
                  <p>
                    <b>Status: </b>
                  </p>
                  <p>{invoice.status}</p>
                  <br className="md:hidden" />
                </div>
              </div>

              <div className="text-sm font-medium md:text-base">
                <p>
                  <b>Notes: </b>
                </p>
                <p>{invoice.notes === "-" ? "-" : invoice.notes}</p>
              </div>
            </div>

            <hr className="md:hidden mt-6" />
            <br />

            {/* mobile view - btn group */}
            <div className="flex items-center justify-between md:hidden">
              <button className="group button-custom bg-[#246A3D]">
                <div>{React.createElement(AiFillPrinter, { size: "12" })}</div>
                <h2 className="whitespace-pre">Print Invoice</h2>
              </button>
              <Link
                className="group button-custom bg-[#0E3658]"
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
                <h2 className="whitespace-pre">Delete</h2>
              </button>
            </div>

            {/* invoices */}
            <div
              className={`table-div-custom mt-6 w-full md:w-fit ${
                theme.dark ? "text-black" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg md:text-xl">Items</h1>
                <div className="flex md:items-center justify-between flex-col md:flex-row md:gap-10 text-sm">
                  <p>
                    <b>Total Items: </b>
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

              {/* large screen view */}
              <div className="overflow-auto rounded-lg shadow hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                        Amount
                      </th>
                      <th className="w-96 p-3 text-sm font-semibold tracking-wide text-left">
                        Item Name
                      </th>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                        Price (/Unit)
                      </th>
                      <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                        Total
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {invoice.contents.map((content, i) => (
                      <tr className="bg-white" key={invoice._id + "-" + i}>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                          {content.amount + " " + content.unit}
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                          {content.item_name}
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                          {content.price_per_item.toLocaleString("en-US", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })}{" "}
                          /{content.price_unit}
                        </td>
                        <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
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

              {/* mobile view */}
              <hr className="md:hidden" />
              <br className="md:hidden" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {invoice.contents.map((content, i) => (
                  <div
                    className="bg-white space-y-3 p-4 rounded-lg shadow"
                    key={"mobile-" + invoice._id + "-" + i}
                  >
                    <div className="text-sm font-medium text-black">
                      <b>Amount: </b>
                      {content.amount + " " + content.unit}
                    </div>
                    <div className="text-sm font-medium text-black">
                      <b>Item Name: </b>
                      {content.item_name}
                    </div>
                    <div className="text-sm font-medium text-black">
                      <b>Price (/Unit): </b>
                      {content.price_per_item.toLocaleString("en-US", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      })}{" "}
                      /{content.price_unit}
                    </div>
                    <div className="text-sm font-medium text-black">
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
      </main>
    </section>
  );
}

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
