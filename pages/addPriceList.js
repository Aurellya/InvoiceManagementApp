import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { getSession, useSession, signOut } from "next-auth/react";

import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Inform.module.css";

export default function addPriceList() {
  // auth
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  // theme
  const theme = useContext(ThemeContext);

  // handle form data
  const [data, setData] = useState({
    product_name: "",
    amount: 0,
    unit: "",
    price: "",
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
    if (name === "amount" || name === "price") {
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
      remarks: data.remarks,
    };

    // Send data to the backend via POST
    fetch("http://localhost:3000/api/priceLists", {
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
      <Head>
        <title>Add Item Form</title>
      </Head>

      <section className="flex w-full">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
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

          {/* form */}
          <form className="w-full" onSubmit={submitForm}>
            <div className="m-auto bg-slate-50 rounded-md w-full grid lg:grid-cols-9 drop-shadow-md border border-t-8 border-t-[#0E3658]">
              <div
                className={`${styles.imgStyle} lg:col-span-6 hidden lg:block`}
              >
                <div className={styles.illustrationImg}></div>
              </div>

              {/* top */}
              <div
                className={`pb-8 pt-6 px-6 md:px-16 ${styles.imgStyle2} lg:col-span-3`}
              >
                <div>
                  <div className="title text-center mb-6">
                    <h1 className="text-gray-800 text-3xl md:text-4xl font-bold py-4">
                      Add Item Form
                    </h1>
                  </div>

                  {/* Product name */}
                  <div className="form-group mb-6">
                    <label
                      htmlFor="product_name"
                      className="form-label inline-block mb-2"
                    >
                      Product Name:
                    </label>
                    <input
                      autoComplete="off"
                      type="text"
                      className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                      name="product_name"
                      id="product_name"
                      placeholder="Enter Product Name"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div className="form-group mb-6">
                    <div>
                      <label
                        htmlFor="amount"
                        className="form-label inline-block mb-2"
                      >
                        Amount (/Unit):
                      </label>

                      <div className="flex">
                        <input
                          autoComplete="off"
                          type="number"
                          className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="amount"
                          id="amount"
                          placeholder="Enter Amount"
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="unit" className="sr-only">
                          Unit
                        </label>
                        <select
                          id="unit"
                          name="unit"
                          className="pl-1 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border rounded-r border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          required
                          onChange={handleChange}
                          defaultValue={""}
                        >
                          <option disabled value=""></option>
                          <option value="bh">/bh</option>
                          <option value="ls">/ls</option>
                          <option value="grs">/grs</option>
                          <option value="dus">/dus</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="form-group mb-6">
                    <label
                      htmlFor="price"
                      className="form-label inline-block mb-2"
                    >
                      Price:
                    </label>
                    <input
                      autoComplete="off"
                      type="price"
                      className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                      name="price"
                      id="price"
                      placeholder="Enter Price"
                      onChange={handleChange}
                      onFocus={(e) => onFocus(e)}
                      onBlur={(e) => onBlur(e)}
                      required
                    />
                  </div>
                </div>

                <div>
                  {/* Remarks */}
                  <div className="form-group mb-6">
                    <label
                      htmlFor="remarks"
                      className="form-label inline-block mb-2"
                    >
                      Remarks:
                    </label>
                    <textarea
                      autoComplete="off"
                      type="text"
                      className="form-control block px-3 py-1.5 w-full h-32 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                      name="remarks"
                      id="remarks"
                      placeholder="Enter Remarks"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                <div className="text-center mt-8">
                  {/* submit button */}
                  <button
                    type="submit"
                    className="group text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-[#0E3658] text-white hover:opacity-80 transition duration-700 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </section>
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
