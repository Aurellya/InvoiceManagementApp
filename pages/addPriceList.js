import React, { useState, useContext } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";

import { ThemeContext } from "../context/ThemeContext";
import LayoutIn from "../layout/layoutIn";

import { TbFileInvoice } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";

export default function addPriceList() {
  // auth
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // handle form data
  const [data, setData] = useState({
    product_name: "",
    amount: 0,
    unit: "",
    price: "",
    vip_price: "",
    remarks: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  // helper function
  function localStringToNumber(s) {
    return Number(String(s).replace(/[^0-9.-]+/g, ""));
  }

  function onFocus(e) {
    let value = e.target.value;
    e.target.value = value ? localStringToNumber(value) : "";
  }

  function onBlur(e) {
    let options = {
      maximumFractionDigits: 0,
      currency: "IDR",
      style: "currency",
      currencyDisplay: "symbol",
    };
    let value = e.target.value;
    e.target.value =
      value || value === 0
        ? localStringToNumber(value).toLocaleString(undefined, options)
        : "";
  }

  // when data changes
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // change format
    if (name === "amount" || name === "price" || name === "vip_price") {
      value = localStringToNumber(value);
    }

    setData({
      ...data,
      [name]: value,
    });
  };

  // handle submit form data
  const submitForm = (e) => {
    e.preventDefault();

    var jsonData = {
      product_name: data.product_name,
      amount: data.amount,
      unit: data.unit,
      price: data.price,
      vip_price: data.vip_price,
      remarks: data.remarks,
    };

    // Send data to the backend via POST
    fetch(`http://localhost:3000/api/mypricelists/${session.group_code}`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = "/priceList";
      } else {
        setErrorMsg("Failed to Add Item! Try Again!");
      }
    });

    // console.log(jsonData);
  };

  return (
    <>
      <LayoutIn
        title={
          theme.language === "Bahasa"
            ? "Formulir Tambah Barang"
            : "Add Item Form"
        }
        role={session.role}
      >
        <main className="pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full max-w-[1536px]">
          {/* header section */}
          <div className="flex md:items-center justify-between w-full mb-6 md:mb-12">
            <div className="flex items-center gap-8">
              <Link
                className={`${
                  theme.dark ? "bg-dm_secondary" : "bg-primary"
                } group button-custom bg-primary`}
                href="/priceList"
              >
                <div>
                  {React.createElement(IoArrowBackOutline, { size: "12" })}
                </div>
                <h2 className="whitespace-pre">
                  {theme.language === "Bahasa" ? "Kembali" : "Back"}
                </h2>
              </Link>
              <h3 className="text-3xl md:text-4xl font-bold">
                {theme.language === "Bahasa"
                  ? "Formulir Tambah Barang"
                  : "Add Item Form"}
              </h3>
            </div>
            <hr className="md:hidden" />
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
                  <title>
                    {theme.language === "Bahasa" ? "Tutup" : "Close"}
                  </title>
                  <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                </svg>
              </button>
            </div>
          )}

          {/* add item form */}
          <form className="w-full" onSubmit={submitForm}>
            <div
              className={`table-div-custom my-4 md:my-0 px-6 pt-6 pb-1 md:p-6 ${
                theme.dark ? "text-neutral !bg-dm_secondary" : ""
              }`}
            >
              <div>
                <h2 className="text-lg md:text-xl mb-3">
                  {theme.language === "Bahasa"
                    ? "Rincian Barang"
                    : "Item Details"}
                </h2>
              </div>

              <hr />
              <br />

              <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 pb-2 pt-3 mb-3 md:mb-0">
                {/* left */}
                <div
                  className={`${
                    theme.dark ? "text-neutral" : "text-primary"
                  } lg:col-span-4 flex justify-center items-center lg:mt-[-60px] mb-10 lg:mb-0`}
                >
                  <div
                    className={`${
                      theme.dark ? "border-y-neutral" : "border-y-primary"
                    } border-y-8 rounded-full w-fit p-3`}
                  >
                    {React.createElement(TbFileInvoice, { size: "220" })}
                  </div>
                </div>

                {/* right */}
                <div className="lg:col-span-8 lg:pr-8">
                  <div className="lg:grid lg:grid-cols-12 gap-10 font-medium text-base">
                    {/* first col */}
                    <div className="lg:col-span-6">
                      {/* product name */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="product_name"
                          className="form-label inline-block mb-2"
                        >
                          <b>
                            {theme.language === "Bahasa"
                              ? "Nama Produk:"
                              : "Product Name:"}
                          </b>
                        </label>
                        <input
                          autoComplete="off"
                          type="text"
                          className={`${
                            theme.dark
                              ? "!bg-dm_secondary text-neutral"
                              : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                          } form-control block w-full px-3 py-1.5 font-normal bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="product_name"
                          id="product_name"
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* remarks */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="remarks"
                          className="form-label inline-block mb-2"
                        >
                          <b>
                            {theme.language === "Bahasa"
                              ? "Keterangan:"
                              : "Remarks:"}
                          </b>
                        </label>
                        <textarea
                          autoComplete="off"
                          type="text"
                          className={`${
                            theme.dark
                              ? "!bg-dm_secondary text-neutral"
                              : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                          } form-control block px-3 py-1.5 w-full h-[135px] font-normal bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="remarks"
                          id="remarks"
                          onChange={handleChange}
                        ></textarea>
                      </div>
                    </div>

                    {/* second col */}
                    <div className="lg:col-span-6">
                      {/* amount */}
                      <div className="form-group mb-6">
                        <div>
                          <label
                            htmlFor="amount"
                            className="form-label inline-block mb-2"
                          >
                            <b>
                              {theme.language === "Bahasa"
                                ? "Jumlah (/Unit):"
                                : "Amount (/Unit):"}
                            </b>
                          </label>

                          <div className="flex">
                            <input
                              autoComplete="off"
                              type="number"
                              className={`${
                                theme.dark
                                  ? "!bg-dm_secondary text-neutral"
                                  : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                              } form-control block w-full px-3 py-1.5 font-normal bg-clip-padding border border-solid rounded-l transition ease-in-out m-0 focus:outline-none`}
                              name="amount"
                              id="amount"
                              onChange={handleChange}
                              required
                            />
                            <label htmlFor="unit" className="sr-only">
                              Unit
                            </label>
                            <select
                              id="unit"
                              name="unit"
                              className={`bg-white pl-1 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded-r transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                              // ${
                              //   theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                              // }
                              required
                              onChange={handleChange}
                              defaultValue={""}
                            >
                              <option disabled value=""></option>
                              <option value="bh">
                                {theme.language === "Bahasa" ? "bh" : "pcs"}
                              </option>
                              <option value="ls">
                                {theme.language === "Bahasa" ? "ls" : "doz"}
                              </option>
                              <option value="grs">
                                {theme.language === "Bahasa" ? "grs" : "gro"}
                              </option>
                              <option value="dus">
                                {theme.language === "Bahasa" ? "dus" : "box"}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* price */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="price"
                          className="form-label inline-block mb-2"
                        >
                          <b>
                            {theme.language === "Bahasa" ? "Harga:" : "Price:"}
                          </b>
                        </label>
                        <input
                          autoComplete="off"
                          type="price"
                          className={`${
                            theme.dark
                              ? "!bg-dm_secondary text-neutral"
                              : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                          } form-control block w-full px-3 py-1.5 font-normal bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="price"
                          id="price"
                          onChange={handleChange}
                          onFocus={(e) => onFocus(e)}
                          onBlur={(e) => onBlur(e)}
                          required
                        />
                      </div>

                      {/* VIP price */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="vip_price"
                          className="form-label inline-block mb-2"
                        >
                          <b>
                            {theme.language === "Bahasa"
                              ? "Harga VIP:"
                              : "VIP Price:"}
                          </b>
                        </label>
                        <input
                          autoComplete="off"
                          type="price"
                          className={`${
                            theme.dark
                              ? "!bg-dm_secondary text-neutral"
                              : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                          } form-control block w-full px-3 py-1.5 font-normal bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="vip_price"
                          id="vip_price"
                          onChange={handleChange}
                          onFocus={(e) => onFocus(e)}
                          onBlur={(e) => onBlur(e)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* submit button */}
                  <div className="text-center mt-8">
                    <button
                      type="submit"
                      className="group text-sm font-bold gap-2 py-2 px-8 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </main>
      </LayoutIn>
    </>
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
