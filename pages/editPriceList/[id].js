import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactLoading from "react-loading";
import { getSession, useSession } from "next-auth/react";

import { ThemeContext } from "../../context/ThemeContext";
import LayoutIn from "../../layout/layoutIn";

import { IoArrowBackOutline } from "react-icons/io5";
import { TbFileInvoice } from "react-icons/tb";

export default function editPriceList() {
  // auth
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();
  const getItemDetails = async () => {
    setLoading(true);

    // Get ID from URL
    const { id } = router.query;
    // get item data from the database
    const res = await fetch(`http://localhost:3000/api/priceLists/${id}`);
    const itemObj = await res.json();
    const item = itemObj.data;

    setItem(item);
    setLoading(false);
  };

  useEffect(() => {
    getItemDetails();
  }, []);

  // handle form data
  const [data, setData] = useState();

  // set default form data from the existing data
  useEffect(() => {
    if (item) {
      setData({
        product_name: item.product_name,
        amount: item.amount,
        unit: item.unit,
        price: item.price,
        vip_price: item.vip_price,
        remarks: item.remarks,
      });
    }
  }, [item]);

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
    fetch(`http://localhost:3000/api/priceLists/${item._id}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = `/priceList/${item._id}`;
      } else {
        setErrorMsg("Failed to Edit Item! Try Again!");
      }
    });

    // console.log(jsonData);
  };

  return (
    <LayoutIn
      title={
        theme.language === "Bahasa" ? "Formulir Edit Barang" : "Edit Item Form"
      }
      role={session.role}
    >
      <main className="container py-12 mx-10 md:mx-14">
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-6 md:gap-0 w-fit md:w-full md:mb-12">
          <div className="flex items-center gap-8">
            <Link
              className={`${
                theme.dark ? "bg-dm_secondary" : "bg-primary"
              } group flex items-center text-sm font-bold gap-2 py-2 px-4 text-white hover:opacity-80 transition duration-700 rounded-md`}
              href={`/priceList/${router.query.id}`}
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
                ? "Formulir Edit Barang"
                : "Edit Item Form"}
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
                <title>{theme.language === "Bahasa" ? "Tutup" : "Close"}</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </button>
          </div>
        )}

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

        {!loading && !data && (
          <div className="py-8">
            <div className="mt-9 flex flex-col justify-center items-center">
              <h3 className="text-xl mb-4 font-bold">
                {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
              </h3>
            </div>
          </div>
        )}

        {/* contents */}
        {!loading && data && (
          <form className="w-full" onSubmit={submitForm}>
            <div
              className={`table-div-custom my-4 md:my-0 px-6 pt-6 pb-1 md:p-6 ${
                theme.dark ? "text-neutral !bg-dm_secondary" : ""
              }`}
            >
              <div>
                <h2 className="text-lg md:text-xl mb-3">
                  {theme.language === "Bahasa"
                    ? "Rincican Barang"
                    : "Item Details"}
                </h2>
              </div>

              <hr />
              <br />

              {/* edit item form */}
              <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 pb-2 pt-3 mb-3 md:mb-0">
                {/* left */}
                <div
                  className={`${
                    theme.dark ? "text-neutral" : "text-primary"
                  } lg:col-span-6 flex justify-center items-center mb-10 lg:mb-0`}
                >
                  <div
                    className={`${
                      theme.dark ? "border-y-neutral" : "border-y-primary"
                    } border-y-8 rounded-full w-fit p-6 lg:mt-[-100px]`}
                  >
                    {React.createElement(TbFileInvoice, { size: "200" })}
                  </div>
                  <div
                    className={`${
                      theme.dark ? "border-y-neutral" : "border-y-primary"
                    } border-y-8 rounded-full w-fit p-6 hidden md:block md:ml-[-20px]`}
                  >
                    {React.createElement(TbFileInvoice, { size: "200" })}
                  </div>
                </div>

                {/* right */}
                <div className="lg:col-span-4">
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
                      } form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                      name="product_name"
                      id="product_name"
                      onChange={handleChange}
                      required
                      defaultValue={data.product_name ? data.product_name : ""}
                    />
                  </div>

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
                          } form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                          name="amount"
                          id="amount"
                          onChange={handleChange}
                          required
                          defaultValue={data.amount ? data.amount : 0}
                        />
                        <label htmlFor="unit" className="sr-only">
                          Unit
                        </label>
                        <select
                          id="unit"
                          name="unit"
                          className={`${
                            theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                          } pl-1 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding rounded rounded-l-sm transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                          required
                          onChange={handleChange}
                          defaultValue={data.unit ? data.unit : ""}
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
                      <b>{theme.language === "Bahasa" ? "Harga:" : "Price:"}</b>
                    </label>
                    <input
                      autoComplete="off"
                      type="price"
                      className={`${
                        theme.dark
                          ? "!bg-dm_secondary text-neutral"
                          : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                      } form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                      name="price"
                      id="price"
                      onChange={handleChange}
                      onFocus={(e) => onFocus(e)}
                      onBlur={(e) => onBlur(e)}
                      defaultValue={data.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      })}
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
                      } form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                      name="vip_price"
                      id="vip_price"
                      onChange={handleChange}
                      onFocus={(e) => onFocus(e)}
                      onBlur={(e) => onBlur(e)}
                      defaultValue={
                        data.vip_price
                          ? data.vip_price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            })
                          : ""
                      }
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
                      } form-control block px-3 py-1.5 w-full h-32 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                      name="remarks"
                      id="remarks"
                      // placeholder={
                      //   theme.language === "Bahasa"
                      //     ? "Masukkan Keterangan"
                      //     : "Enter Remarks"
                      // }
                      onChange={handleChange}
                      defaultValue={data.remarks ? data.remarks : ""}
                    ></textarea>
                  </div>

                  {/* submit button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="group text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
                    >
                      {theme.language === "Bahasa" ? "Simpan" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
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
