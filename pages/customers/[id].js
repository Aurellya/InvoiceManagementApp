import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../../context/ThemeContext";
import LayoutIn from "../../layout/layoutIn";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { IoArrowBackOutline } from "react-icons/io5";
import { TiUserOutline } from "react-icons/ti";

export default function Customer() {
  // session
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [customer, setCustomer] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const getCustomer = async () => {
    setLoading(true);

    // Get ID from URL
    const { id } = router.query;
    // get customers data from the database
    const res = await fetch(`http://localhost:3000/api/customers/${id}`);
    const customerObj = await res.json();
    const customer = customerObj.data;

    setCustomer(customer);
    setLoading(false);
  };

  useEffect(() => {
    getCustomer();
  }, []);

  // function to display delete confirmation dialog
  function showModalDeleteConfirmation() {
    document.getElementById("modal").style.display = "block";
  }

  const cancelDeleteCustomer = (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";
  };

  // function to delete a particular Customer
  const deleteCustomer = (e) => {
    e.preventDefault();
    document.getElementById("modal").style.display = "none";

    // Send data to the backend via POST
    fetch(`http://localhost:3000/api/customers/${customer._id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = `/customers`;
      } else {
        setErrorMsg("Failed to Delete Customer! Try Again!");
      }
    });
  };

  return (
    <LayoutIn
      title={
        theme.language === "Bahasa" ? "Rincian Pelanggan" : "Customer Details"
      }
      role={session.role}
    >
      <main className="container py-12 mx-10 md:mx-14">
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full md:mb-12">
          <div className="flex items-center gap-8">
            <Link
              className={`${
                theme.dark ? "bg-dm_secondary" : "bg-primary"
              } group button-custom`}
              href="/customers"
            >
              <div>
                {React.createElement(IoArrowBackOutline, { size: "12" })}
              </div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Kembali" : "Back"}
              </h2>
            </Link>
            <h3 className="text-3xl md:text-4xl font-bold">
              {theme.language === "Bahasa" ? "Pelanggan" : "Customer"}
            </h3>
          </div>

          {/* btn group: for large screen view */}
          {session && session.role == "admin" && (
            <div className="items-center gap-2 hidden md:flex">
              <Link
                className={`${
                  theme.dark ? "bg-dm_secondary" : "bg-primary"
                } group button-custom`}
                href={`/editCustomer/${router.query.id}`}
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
            </div>
          )}
        </div>

        {/* modal */}
        <div className="hidden" id="modal">
          <div className="bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
            <div className="bg-white px-10 py-8 rounded-md text-center">
              <h1 className="text-xl mb-6 font-bold">
                {theme.language === "Bahasa"
                  ? "Apakah Kamu Yakin Mau Menghapus Nota?"
                  : "Do you Want Delete?"}
              </h1>
              <button
                className="bg-[#F44645] px-4 py-2 rounded-md text-md text-white"
                onClick={cancelDeleteCustomer}
              >
                {theme.language === "Bahasa" ? "Batal" : "Cancel"}
              </button>
              <button
                className="bg-tertiary px-7 py-2 ml-4 rounded-md text-md text-white font-semibold"
                onClick={deleteCustomer}
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
                <title>{theme.language === "Bahasa" ? "Tutup" : "Close"}</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        )}

        {/* content */}
        <div
          className={`table-div-custom my-4 md:my-0 p-6 block mb-4 md:mb-0 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <div>
            <h1 className="text-lg md:text-xl mb-3">
              {theme.language === "Bahasa"
                ? "Rincian Pelanggan"
                : "Customer Details"}
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
                <ReactLoading
                  type="bars"
                  color="#2b4450"
                  height={100}
                  width={50}
                />
              </div>
            </div>
          )}

          {!loading && !customer && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">
                  {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
                </h3>
              </div>
            </div>
          )}

          {/* customer details */}
          {!loading && customer && (
            <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 pb-0 md:pb-2 pt-3">
              {/* left */}
              <div
                className={`${
                  theme.dark ? "text-neutral" : "text-primary"
                } lg:col-span-4 flex justify-center items-center mb-10 lg:mb-0`}
              >
                <div
                  className={`${
                    theme.dark ? "border-y-neutral" : "border-y-primary"
                  } border-y-8 rounded-full w-fit p-3`}
                >
                  {React.createElement(TiUserOutline, { size: "220" })}
                </div>
              </div>

              {/* right */}
              <div className="flex gap-0 md:gap-16 flex-col md:flex-row col-span-8">
                <div className="md:px-4 py-1 md:flex gap-20 md:gap-40 font-medium text-base whitespace-nowrap">
                  <div>
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Nomor Pelanggan: "
                          : "Customer No: "}
                      </b>
                    </p>
                    <p>{customer._id}</p>
                    <br />
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Nama Pelanggan: "
                          : "Customer Name: "}
                      </b>
                    </p>
                    <p>{customer.name}</p>
                    <br />
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Nomor Telepon: "
                          : "Phone No: "}
                      </b>
                    </p>
                    <p>{customer.phone_no}</p>
                    <br />
                    <p>
                      <b>Email: </b>
                    </p>
                    <p>{customer.email}</p>
                    <br className="md:hidden" />
                  </div>

                  <div className="font-medium text-base">
                    <p>
                      <b>
                        {theme.language === "Bahasa" ? "Alamat: " : "Address: "}
                      </b>
                    </p>
                    <p>{customer.address}</p>
                    <br />
                    <p>
                      <b>
                        {theme.language === "Bahasa"
                          ? "Keterangan: "
                          : "Remarks: "}
                      </b>
                    </p>
                    <p>{customer.remarks ? customer.remarks : "-"}</p>
                  </div>
                </div>

                <hr className="md:hidden my-6" />

                {/* btn group: for mobile view */}
                {session && session.role == "admin" && (
                  <div className="flex items-center justify-between md:hidden">
                    <Link
                      className="group button-custom bg-primary"
                      href={`/editCustomer/${router.query.id}`}
                    >
                      <div>
                        {React.createElement(AiFillEdit, { size: "12" })}
                      </div>
                      <h2 className="whitespace-pre">Edit</h2>
                    </Link>
                    <button
                      className="group button-custom bg-[#F44645]"
                      onClick={showModalDeleteConfirmation}
                    >
                      <div>
                        {React.createElement(AiFillDelete, { size: "12" })}
                      </div>
                      <h2 className="whitespace-pre">
                        {theme.language === "Bahasa" ? "Hapus" : "Delete"}
                      </h2>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </LayoutIn>
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
