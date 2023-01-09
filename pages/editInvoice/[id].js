import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getSession, useSession, signOut } from "next-auth/react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";

import { AiFillMinusCircle } from "react-icons/ai";
import { BsFillCalculatorFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

import ReactLoading from "react-loading";

export default function editInvoice() {
  // auth
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

  // handle table rows
  const [noOfRows, setNoOfRows] = useState(0);

  // handle form data
  const [data, setData] = useState();

  // set default form data from the existing data
  useEffect(() => {
    if (invoice) {
      // change existing data ._id to artificial id
      invoice.contents.map((content, i) => {
        content._id = i;
      });

      setData({
        cname: invoice.customer_name,
        status: invoice.status,
        notes: invoice.notes,
        contents: invoice.contents,
      });

      setNoOfRows(invoice.contents.length);
    }
  }, [invoice]);

  useEffect(() => {
    if (data && data.contents) {
      // executed once
      if (
        localStringToNumber(document.getElementById("grandTotal").innerText) ==
          0 &&
        noOfRows == invoice.contents.length
      ) {
        data.contents.map((content, i) => {
          document.getElementById(`amount-${i}`).value = content.amount;
          document.getElementById(`unit-${i}`).value = content.unit;
          document.getElementById(`itemNameInput-${i}`).value =
            content.item_name;
          document.getElementById(`pricePerItemInput-${i}`).value =
            content.price_per_item.toLocaleString("en-US", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            });
          document.getElementById(`price_unit-${i}`).value = content.price_unit;
          document.getElementById(`totalInput-${i}`).value =
            content.total.toLocaleString("en-US", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            });
        });
      }

      // recalculate grand total if there is a change in data
      let grandTotal = 0;
      data.contents.map((c, i) => {
        if (c["total"]) {
          grandTotal += Number(c["total"]);
        }
      });

      document.getElementById("grandTotal").innerText =
        grandTotal || grandTotal === 0
          ? localStringToNumber(grandTotal).toLocaleString(undefined, {
              maximumFractionDigits: 0,
              currency: "IDR",
              style: "currency",
              currencyDisplay: "symbol",
            })
          : "";
    }
  }, [data]);

  const addRow = (e) => {
    e.preventDefault();

    // find element's id
    let _id = noOfRows;

    setData({
      ...data,
      ["contents"]: [...data.contents, { _id: Number(_id) }],
    });

    setNoOfRows(noOfRows + 1);
  };

  const deleteRow = (e, i) => {
    e.preventDefault();

    let ele = document.getElementById(`tr-${i}`);
    ele.parentNode.removeChild(ele);

    // update state data
    let filteredContents = data.contents.filter((c) => {
      return c._id != i;
    });

    setData({
      ...data,
      ["contents"]: filteredContents,
    });

    // setNoOfRows(noOfRows - 1);
  };

  // helper function
  function localStringToNumber(s) {
    return Number(String(s).replace(/[^0-9.-]+/g, ""));
  }

  function onFocus(e) {
    let value = e.target.value;
    e.target.value = value ? localStringToNumber(value) : "";

    // if total input is clicked, show suggestion (auto-calculate)
    if (e.target.name === "total") {
      // find the row by using the element's id
      let _id = e.target.id.split("-")[1];
      let row = data.contents.filter((c) => {
        return c._id == _id;
      })[0];

      if (row) {
        let validAmount = row.amount && row.amount !== 0;
        let validUnit = row.unit && row.unit !== "";
        let validPricePerItem = row.price_per_item && row.price_per_item !== 0;
        let validPriceUnit = row.price_unit && row.price_unit !== "";

        if (validAmount && validUnit && validPricePerItem && validPriceUnit) {
          // show suggestion
          let convertedUnit = 1; // default
          let from = row.unit;
          let to = row.price_unit;

          if (from === "bh") {
            switch (to) {
              case "ls":
                convertedUnit = 1 / 12;
                break;
              case "grs":
                convertedUnit = 1 / 144;
                break;
              default:
                break;
            }
          } else if (from === "ls") {
            switch (to) {
              case "bh":
                convertedUnit = 12;
                break;
              case "grs":
                convertedUnit = 1 / 12;
                break;
              default:
                break;
            }
          } else if (from === "grs") {
            switch (to) {
              case "bh":
                convertedUnit = 144;
                break;
              case "ls":
                convertedUnit = 12;
                break;
              default:
                break;
            }
          }

          if (!(from === "dus") ^ (to === "dus")) {
            let suggestion = row.amount * convertedUnit * row.price_per_item;
            document.getElementById("totalInput-" + _id).value = suggestion;
          }
        }
      }
    }
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

    setData({
      ...data,
      [name]: value,
    });
  };

  // when "content" data changes
  const handleChangeContent = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // change format
    if (name === "amount" || name === "total" || name === "price_per_item") {
      value = localStringToNumber(value);
    }

    // find element's id
    let _id = Number(e.target.id.split("-")[1]);

    // find whether id is alerady inside one of the object in array
    const searchIndex = data.contents.findIndex(
      (content) => content._id == _id
    );

    // if not found, create new object
    if (searchIndex == -1) {
      setData({
        ...data,
        ["contents"]: [...data.contents, { _id: _id, [name]: value }],
      });
    }
    // if found, update existing object
    else {
      let prevContents = data.contents.filter((c) => {
        return c._id != _id;
      });

      let updatedContents = data.contents.filter((c) => {
        return c._id == _id;
      })[0];

      updatedContents[name] = value;

      if (prevContents.length != 0) {
        setData({
          ...data,
          ["contents"]: [...prevContents, updatedContents],
        });
      }
      // if it's the first content object inside array
      else {
        setData({
          ...data,
          ["contents"]: [updatedContents],
        });
      }
    }
  };

  // handle submit form data
  const submitForm = (e) => {
    e.preventDefault();

    let contents = data.contents.map(({ _id, ...rest }) => {
      return rest;
    });

    var jsonData = {
      customer_name: data.cname,
      date: invoice.date,
      status: data.status,
      notes: data.notes,
      total_items: data.contents.length,
      total: localStringToNumber(
        document.getElementById("grandTotal").innerText
      ),
      contents: contents,
      // contents: data.contents,
    };

    contents.forEach((object) => {
      delete object["_id"];
    });

    // Send data to the backend via POST
    fetch(`http://localhost:3000/api/invoices/${invoice._id}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = `/invoices/${invoice._id}`;
      } else {
        setErrorMsg("Failed to Edit Invoice! Try Again!");
      }
    });

    // console.log(jsonData);
  };

  return (
    <>
      <Head>
        <title>Edit Invoice Form</title>
      </Head>

      <section className="flex w-full">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-6 md:gap-0 w-fit md:w-full mb-10">
            <div className="flex items-center gap-8">
              <Link
                className="group flex items-center text-sm font-bold gap-2 py-2 px-4 bg-[#0E3658] text-white hover:opacity-80 transition duration-700 rounded-md"
                href={`/invoices/${router.query.id}`}
              >
                <div>
                  {React.createElement(IoArrowBackOutline, { size: "12" })}
                </div>
                <h2 className="whitespace-pre">Back</h2>
              </Link>
              <h3 className="text-3xl md:text-4xl font-bold">
                Edit Invoice Form
              </h3>
            </div>

            <hr className="md:hidden" />

            <div className="flex justify-end">
              <button className="w-fit group flex items-center text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-[#246A3D] text-white hover:opacity-80 transition duration-700 rounded-md">
                <div>
                  {React.createElement(BsFillCalculatorFill, { size: "12" })}
                </div>
                <h2 className="whitespace-pre">Calculator</h2>
              </button>
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

          {/* form */}
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

          {!loading && !data && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">No Data</h3>
              </div>
            </div>
          )}

          {!loading && data && (
            <div className="table-div-custom block mb-4 md:mb-12">
              <form className="flex w-full flex-col" onSubmit={submitForm}>
                {/* top */}
                <div>
                  <div className="">
                    <h2 className="text-lg md:text-xl mb-3">
                      Customer Details
                    </h2>
                  </div>

                  <hr />
                  <br />

                  <div className="flex md:pr-40 md:justify-between md:px-6 flex-col md:flex-row text-sm font-bold md:font-medium md:text-base text-gray-700">
                    {/* top left */}
                    <div>
                      {/* customer name */}
                      <div className="form-group mb-6 w-72">
                        <label
                          htmlFor="cname"
                          className="form-label inline-block mb-2"
                        >
                          Customer Name:
                        </label>
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="cname"
                          id="cname"
                          placeholder="Enter Customer Name"
                          onChange={handleChange}
                          required
                          defaultValue={data.cname}
                        />
                      </div>

                      {/* Date */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="date"
                          className="form-label inline-block mb-2"
                        >
                          Date:
                        </label>
                        <input
                          type="text"
                          className="form-control block px-3 py-1.5 w-72 font-normal text-gray-300 bg-white bg-clip-padding border border-solid border-gray-300 rounded m-0"
                          name="date"
                          id="date"
                          defaultValue={
                            invoice ? invoice.date.substring(0, 10) : "-"
                          }
                          disabled
                        />
                      </div>
                    </div>

                    {/* top center */}
                    {/* notes */}
                    <div>
                      <div className="form-group mb-6">
                        <label
                          htmlFor="notes"
                          className="form-label inline-block mb-2"
                        >
                          Notes:
                        </label>
                        <textarea
                          autoComplete="off"
                          type="text"
                          className="form-control block px-3 py-1.5 w-full md:w-96 h-32 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="notes"
                          id="notes"
                          placeholder="Enter Notes"
                          onChange={handleChange}
                          defaultValue={data.notes}
                        ></textarea>
                      </div>
                    </div>

                    {/* top right */}
                    <div>
                      {/* Status */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="status"
                          className="form-label inline-block mb-3"
                        >
                          Status:
                        </label>
                        <div className="flex px-4 font-medium">
                          <div>
                            <div className="form-check">
                              <input
                                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-[#165081] checked:border--[#165081] focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                type="radio"
                                name="status"
                                id="flexRadioDefault1"
                                value="not paid"
                                defaultChecked={
                                  data.status === "paid" ? false : true
                                }
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label inline-block text-gray-800"
                                htmlFor="flexRadioDefault1"
                              >
                                Not Paid
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                className="form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-[#165081] checked:border-[#165081] focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                                type="radio"
                                name="status"
                                id="flexRadioDefault2"
                                value="paid"
                                defaultChecked={
                                  data.status === "paid" ? true : false
                                }
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label inline-block text-gray-800"
                                htmlFor="flexRadioDefault2"
                              >
                                Paid
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom */}
                <div className="mt-6">
                  <div>
                    <h2 className="text-lg md:text-xl mb-3">Invoice</h2>
                  </div>

                  <hr />
                  <br />

                  <h2 className="text-right px-4">
                    <b>
                      Total:{" "}
                      <span id="grandTotal">
                        {localStringToNumber(0).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                          currency: "IDR",
                          style: "currency",
                          currencyDisplay: "symbol",
                        })}
                      </span>
                    </b>
                  </h2>

                  {/* table */}
                  <div className="overflow-auto rounded-lg shadow mt-4">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200 hidden md:table-header-group">
                        <tr>
                          <th className="w-12 p-3 text-sm font-semibold tracking-wide text-left"></th>
                          <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                            Quantity
                          </th>
                          <th className="min-w-[200px] p-3 text-sm font-semibold tracking-wide text-left">
                            Item Name
                          </th>
                          <th className="w-60 p-3 text-sm font-semibold tracking-wide text-left">
                            Price (/Unit)
                          </th>
                          <th className="w-48 p-3 text-sm font-semibold tracking-wide text-left">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody
                        className="divide-y divide-[#0E3658] md:divide-gray-100"
                        id="invoiceForm"
                      >
                        {/* {data.contents.map((content, i) => ( */}
                        {[...Array(noOfRows).keys()].map((i) => (
                          <tr
                            className="bg-white flex flex-col md:table-row"
                            key={i}
                            id={`tr-${i}`}
                          >
                            <td className="p-3 pb-0 md:pb-3 text-sm text-[#F44645] font-bold whitespace-nowrap text-right md:text-center">
                              <button
                                className="mx-auto pt-1 pl-2"
                                onClick={(e) => deleteRow(e, i)}
                              >
                                <AiFillMinusCircle size={18} />
                              </button>
                            </td>
                            <td className="p-3 pt-0 md:pt-3 text-sm text-[#0E3658] font-bold whitespace-nowrap">
                              <div>
                                <h3 className="md:hidden">Quantity</h3>
                                <div className="relative mt-2 md:mt-0 rounded-md shadow-sm">
                                  <input
                                    autoComplete="off"
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    name="amount"
                                    id={`amount-${i}`}
                                    className="form-control block w-full pl-3 pr-16 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                                    placeholder=""
                                    onChange={handleChangeContent}
                                    required
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center">
                                    <label htmlFor="unit" className="sr-only">
                                      Unit
                                    </label>
                                    <select
                                      id={`unit-${i}`}
                                      name="unit"
                                      className="pl-1 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border rounded rounded-l-sm border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                                      onChange={handleChangeContent}
                                      required
                                      defaultValue={""}
                                    >
                                      <option disabled value=""></option>
                                      <option value="bh">bh</option>
                                      <option value="ls">ls</option>
                                      <option value="grs">grs</option>
                                      <option value="dus">dus</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3 text-sm first-line:text-[#0E3658] font-bold whitespace-nowrap">
                              <h3 className="md:hidden">Item Name</h3>
                              <div className="mt-2 md:mt-0">
                                <input
                                  name="item_name"
                                  autoComplete="off"
                                  type="text"
                                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                                  id={`itemNameInput-${i}`}
                                  placeholder=""
                                  onChange={handleChangeContent}
                                  required
                                />
                              </div>
                            </td>

                            <td className="p-3 text-sm text-[#0E3658] font-bold whitespace-nowrap">
                              <h3 className="md:hidden">Price (/pcs)</h3>
                              <div>
                                <div className="relative mt-2 md:mt-0 rounded-md shadow-sm">
                                  <input
                                    name="price_per_item"
                                    autoComplete="off"
                                    type="text"
                                    className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                                    id={`pricePerItemInput-${i}`}
                                    placeholder=""
                                    onFocus={(e) => onFocus(e)}
                                    onBlur={(e) => onBlur(e)}
                                    onChange={handleChangeContent}
                                    required
                                  />
                                  <div className="absolute inset-y-0 right-0 flex items-center">
                                    <label
                                      htmlFor="price_unit"
                                      className="sr-only"
                                    >
                                      Unit Item
                                    </label>
                                    <select
                                      id={`price_unit-${i}`}
                                      name="price_unit"
                                      className="pl-1 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border rounded rounded-l-sm border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                                      onChange={handleChangeContent}
                                      required
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
                            </td>

                            <td className="p-3 mb-2 md:mb-0 text-sm text-[#0E3658] font-bold whitespace-nowrap">
                              <h3 className="md:hidden">Total</h3>
                              <div className="mt-2 md:mt-0">
                                <input
                                  name="total"
                                  autoComplete="off"
                                  type="text"
                                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                                  id={`totalInput-${i}`}
                                  placeholder=""
                                  onFocus={(e) => {
                                    onFocus(e);
                                    handleChangeContent(e);
                                  }}
                                  onBlur={(e) => onBlur(e)}
                                  onChange={handleChangeContent}
                                  required
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 mb-5 text-right mr-1">
                    {/* add button */}
                    <button
                      className="group gap-2 h-7 px-4 bg-[#0E3658] text-white hover:opacity-80 transition duration-700 rounded-md"
                      onClick={addRow}
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>

                  <div className="text-center">
                    {/* submit button */}
                    <button
                      type="submit"
                      className="group text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-[#0E3658] text-white hover:opacity-80 transition duration-700 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
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