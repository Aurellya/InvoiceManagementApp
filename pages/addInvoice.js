import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";

import { ThemeContext } from "../context/ThemeContext";
import Calculator from "./calculator";
import LayoutIn from "../layout/layoutIn";

import { AiFillMinusCircle } from "react-icons/ai";
import { BsFillCalculatorFill } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";

const AddInvoice = () => {
  // auth
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);
  const ref = useRef(null);

  // load product name
  const [priceLists, setPriceLists] = useState();

  const getPriceLists = async () => {
    const res = await fetch(`/api/mypricelists/${session.group_code}`);
    const priceListsObj = await res.json();
    const priceListsData = priceListsObj.data;
    setPriceLists(priceListsData);
  };

  useEffect(() => {
    getPriceLists();

    const handleClick = (event) => {
      let index = event.target.id.split("-")[1];
      if (index) {
        let get = document.getElementById("suggestionDiv-" + index);
        if (!get.contains(event.target)) {
          get.style.display = "none";
        }
      }
    };

    const element = ref.current;
    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("click", handleClick);
    };
  }, []);

  // handle table rows
  const [noOfRows, setNoOfRows] = useState(1);

  // handle form data
  const [data, setData] = useState({
    cname: "",
    status: "not paid",
    notes: "",
    contents: [],
  });
  const [errorMsg, setErrorMsg] = useState("");

  // helper function
  function localStringToNumber(s) {
    return Number(String(s).replace(/[^0-9.-]+/g, ""));
  }

  useEffect(() => {
    // change grand total
    let grandTotal = 0;

    data.contents.map((c) => {
      if (c["total"]) {
        grandTotal += Number(c["total"]);
      }
    });

    document.getElementById("grandTotal").innerText =
      grandTotal || grandTotal === 0
        ? localStringToNumber(grandTotal).toLocaleString("en-US", {
            maximumFractionDigits: 0,
            currency: "IDR",
            style: "currency",
            currencyDisplay: "symbol",
          })
        : "";
  }, [data.contents]);

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
  };

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
          let convertedUnit = 1;
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
        ? localStringToNumber(value).toLocaleString("en-US", options)
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

  const [suggestions, setSuggestions] = useState();
  const handleSuggestion = (e, val, i) => {
    e.preventDefault();
    const event = new MouseEvent("dblclick", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    let itemInputEle = document.getElementById("itemNameInput-" + i);
    itemInputEle.value = val;
    itemInputEle.dispatchEvent(event);

    // find price of the item
    let itemInfo =
      priceLists &&
      priceLists.filter(
        (item) => item.product_name.toUpperCase() == val.toUpperCase()
      )[0];

    // change price format
    if (itemInfo) {
      let options = {
        maximumFractionDigits: 0,
        currency: "IDR",
        style: "currency",
        currencyDisplay: "symbol",
      };

      let pricePerItemEle = document.getElementById("pricePerItemInput-" + i);
      pricePerItemEle.value = localStringToNumber(
        itemInfo.price
      ).toLocaleString("en-US", options);
      pricePerItemEle.dispatchEvent(event);

      let priceUnitEle = document.getElementById("price_unit-" + i);
      priceUnitEle.value = itemInfo.unit;
      priceUnitEle.dispatchEvent(event);
    }

    let targetId = e.target.parentNode.parentNode;
    let index = targetId.id.split("-")[1];
    if (index) {
      document.getElementById("suggestionDiv-" + index).style.display = "none";
    }
  };

  // when "content" data changes
  const handleChangeContent = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // give suggestion on item/product name
    if (name == "item_name") {
      let index = e.target.id.split("-")[1];
      if (index) {
        document.getElementById("suggestionDiv-" + index).style.display =
          "block";
      }

      let matches = [];
      if (value.length > 0) {
        matches = priceLists.filter((c) =>
          c.product_name.toUpperCase().includes(value.toUpperCase())
        );
        setSuggestions(matches.slice(0, 8));
      }
    }

    // change format
    if (name === "amount" || name === "total" || name === "price_per_item") {
      value = localStringToNumber(value);
    }

    // find element's id
    let _id = e.target.id.split("-")[1];

    // find whether id is alerady inside one of the object in array
    // const searchIndex = data.contents.findIndex((content) => content.id == id);
    const searchIndex = data.contents.findIndex(
      (content) => content._id == _id
    );

    // if not found, create new object
    if (searchIndex == -1) {
      setData({
        ...data,
        ["contents"]: [...data.contents, { _id: Number(_id), [name]: value }],
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
      date: new Date(),
      status: data.status,
      notes: data.notes,
      total_items: data.contents.length,
      total: localStringToNumber(
        document.getElementById("grandTotal").innerText
      ),
      contents: contents,
    };

    contents.forEach((object) => {
      delete object["_id"];
    });

    // Send data to the backend via POST
    fetch(`/api/myinvoices/${session.group_code}`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = "/invoices";
      } else {
        setErrorMsg("Failed to Add Invoice! Try Again!");
      }
    });

    // console.log(jsonData);
  };

  const [showCalc, setShowCalc] = useState(false);

  return (
    <LayoutIn
      title={
        theme.language === "Bahasa" ? "Formulir Buat Nota" : "Add Invoice Form"
      }
      role={session.role}
    >
      <main
        className="pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full max-w-[1536px]"
        ref={ref}
      >
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full md:mb-12">
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
              {theme.language === "Bahasa"
                ? "Formulir Buat Nota"
                : "Add Invoice Form"}
            </h3>
          </div>

          <hr className="md:hidden" />

          <div className="flex justify-end">
            <button
              onClick={() => setShowCalc(!showCalc)}
              className="w-fit group flex items-center text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-tertiary text-white hover:opacity-80 transition duration-700 rounded-md"
            >
              <div>
                {React.createElement(BsFillCalculatorFill, { size: "12" })}
              </div>
              <h2 className="whitespace-pre">
                {theme.language === "Bahasa" ? "Kalkulator" : "Calculator"}
              </h2>
            </button>
          </div>
        </div>

        {/* calculator */}
        {showCalc && (
          <div className="" id="calculator">
            <div className="z-50 bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
              <Calculator closeCalculator={() => setShowCalc(!showCalc)} />
            </div>
          </div>
        )}

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

        {/* add invoice form */}
        <form className="w-full" onSubmit={submitForm}>
          <div
            className={`table-div-custom my-4 md:my-0 px-6 pt-6 pb-1 md:p-6 ${
              theme.dark ? "text-neutral !bg-dm_secondary" : ""
            }`}
          >
            <div>
              <h2 className="text-lg md:text-xl mb-3">
                {theme.language === "Bahasa"
                  ? "Rincian Nota"
                  : "Invoice Details"}
              </h2>
            </div>

            <hr />
            <br />

            <div className="lg:grid lg:grid-cols-12 gap-10">
              {/* left */}
              <div
                className={`md:py-2 px-0 md:px-4 lg:col-span-3 rounded-bl-md rounded-md text-sm font-bold md:font-medium md:text-base ${
                  theme.dark ? "text-neutral" : "text-gray-700"
                }`}
              >
                {/* customer name */}
                <div className="form-group mb-6">
                  <label
                    htmlFor="cname"
                    className="form-label inline-block mb-2"
                  >
                    {theme.language === "Bahasa"
                      ? "Nama Pelanggan:"
                      : "Customer Name:"}
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    className={`${
                      theme.dark
                        ? "!bg-dm_secondary text-neutral"
                        : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                    } form-control block w-full px-3 py-1.5 font-normal bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                    name="cname"
                    id="cname"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* date */}
                <div className="form-group mb-6">
                  <label
                    htmlFor="date"
                    className="form-label inline-block mb-2"
                  >
                    {theme.language === "Bahasa" ? "Tanggal:" : "Date:"}
                  </label>
                  <input
                    type="text"
                    className={`${
                      theme.dark
                        ? "!bg-primary text-neutral"
                        : "text-gray-400 bg-gray-200"
                    } form-control block px-3 py-1.5 w-full font-normal bg-clip-padding border border-solid rounded m-0 border-gray-300`}
                    name="date"
                    id="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    disabled
                  />
                </div>

                {/* status */}
                <div className="form-group mb-6">
                  <label
                    htmlFor="status"
                    className="form-label inline-block mb-3"
                  >
                    {theme.language === "Bahasa" ? "Pembayaran:" : "Status:"}
                  </label>
                  <div className="flex px-4 font-medium">
                    <div>
                      <div className="form-check">
                        <input
                          className="form-check-input appearance-none rounded-full h-4 w-4 border-2 border-gray-300 bg-white checked:bg-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="radio"
                          name="status"
                          id="flexRadioDefault1"
                          value="not paid"
                          defaultChecked={data.status === "paid" ? false : true}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label inline-block"
                          htmlFor="flexRadioDefault1"
                        >
                          {theme.language === "Bahasa" ? "Belum" : "Not Paid"}
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input appearance-none rounded-full h-4 w-4 border-2 border-gray-300 bg-white checked:bg-primary focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                          type="radio"
                          name="status"
                          id="flexRadioDefault2"
                          value="paid"
                          defaultChecked={data.status === "paid" ? true : false}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label inline-block"
                          htmlFor="flexRadioDefault2"
                        >
                          {theme.language === "Bahasa" ? "Sudah" : "Paid"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* notes */}
                <div>
                  <div className="form-group mb-10">
                    <label
                      htmlFor="notes"
                      className="form-label inline-block mb-2"
                    >
                      {theme.language === "Bahasa" ? "Catatan:" : "Notes:"}
                    </label>
                    <textarea
                      autoComplete="off"
                      type="text"
                      className={`${
                        theme.dark
                          ? "!bg-dm_secondary text-neutral"
                          : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                      } form-control block px-3 py-1.5 w-full h-32 font-normal bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                      name="notes"
                      id="notes"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>

                {/* submit button */}
                <div className="text-center hidden lg:block">
                  <button
                    type="submit"
                    className="text-sm font-bold py-2 px-8 md:px-4 bg-primary text-white hover:opacity-70 transition duration-700 rounded-md"
                  >
                    Submit
                  </button>
                </div>
              </div>

              {/* right */}
              <div
                className={`lg:col-span-9 lg:block w-full lg:overflow-x-auto`}
              >
                <h2 className="text-lg md:hidden">
                  {theme.language === "Bahasa" ? "Barang" : "Items"}
                </h2>
                <hr className="md:hidden mb-4" />

                <div className="mb-6 px-0 md:px-6">
                  <h2 className="text-right px-4">
                    <b>
                      Total:{" "}
                      <span id="grandTotal">
                        {localStringToNumber(0).toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                          currency: "IDR",
                          style: "currency",
                          currencyDisplay: "symbol",
                        })}
                      </span>
                    </b>
                  </h2>
                  {/* table */}
                  <div
                    className="rounded-lg shadow mt-4"
                    // overflow-auto
                  >
                    <table className="w-full">
                      <thead
                        className={`${
                          theme.dark ? "bg-primary" : "bg-gray-50"
                        } border-b-2 border-gray-200 hidden lg:table-header-group`}
                      >
                        <tr>
                          <th className="w-12 p-3 text-sm font-semibold tracking-wide text-left"></th>
                          <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                            {theme.language === "Bahasa"
                              ? "Jumlah"
                              : "Quantity"}
                          </th>
                          <th className="min-w-[250px] p-3 text-sm font-semibold tracking-wide text-left">
                            {theme.language === "Bahasa"
                              ? "Nama Barang"
                              : "Item Name"}
                          </th>
                          <th className="min-w-[220px] w-52 p-3 text-sm font-semibold tracking-wide text-left">
                            {theme.language === "Bahasa"
                              ? "Harga (/Unit)"
                              : "Price (/Unit)"}
                          </th>
                          <th className="min-w-[180px] w-48 p-3 text-sm font-semibold tracking-wide text-left">
                            Total
                          </th>
                        </tr>
                      </thead>

                      <tbody
                        className="divide-y divide-primary lg:divide-gray-100"
                        id="invoiceForm"
                      >
                        {[...Array(noOfRows).keys()].map((i) => (
                          <tr
                            className={`${
                              theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                            } flex flex-col lg:table-row`}
                            key={i}
                            id={`tr-${i}`}
                          >
                            <td className="p-3 pb-0 lg:pb-3 text-sm text-[#F44645] font-bold whitespace-nowrap text-right lg:text-center">
                              <button
                                className="mx-auto pt-1 pl-2"
                                onClick={(e) => deleteRow(e, i)}
                              >
                                <AiFillMinusCircle size={18} />
                              </button>
                            </td>

                            <td
                              className={`p-3 pt-0 lg:pt-3 text-sm text-primary font-bold whitespace-nowrap`}
                            >
                              <div>
                                <h3 className="lg:hidden">
                                  {theme.language === "Bahasa"
                                    ? "Jumlah"
                                    : "Quantity"}
                                </h3>
                                <div className="relative mt-2 lg:mt-0 flex">
                                  <input
                                    autoComplete="off"
                                    type="number"
                                    onWheel={(e) => e.target.blur()}
                                    name="amount"
                                    id={`amount-${i}`}
                                    className={`${
                                      theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                    } form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                                    placeholder=""
                                    onChange={handleChangeContent}
                                    required
                                  />
                                  <label htmlFor="unit" className="sr-only">
                                    Unit
                                  </label>
                                  <select
                                    id={`unit-${i}`}
                                    name="unit"
                                    className={`bg-white px-1 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded-r transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                                    // ${
                                    //   theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                    // }

                                    onChange={handleChangeContent}
                                    required
                                    defaultValue={""}
                                  >
                                    <option disabled value=""></option>
                                    <option value="bh">
                                      {theme.language === "Bahasa"
                                        ? "bh"
                                        : "pcs"}
                                    </option>
                                    <option value="ls">
                                      {theme.language === "Bahasa"
                                        ? "ls"
                                        : "doz"}
                                    </option>
                                    <option value="grs">
                                      {theme.language === "Bahasa"
                                        ? "grs"
                                        : "gro"}
                                    </option>
                                    <option value="dus">
                                      {theme.language === "Bahasa"
                                        ? "dus"
                                        : "box"}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </td>

                            <td className="p-3 text-sm first-line:text-primary font-bold whitespace-nowrap">
                              <h3 className="lg:hidden">
                                {theme.language === "Bahasa"
                                  ? "Nama Barang"
                                  : "Item Name"}
                              </h3>
                              <div className="mt-2 lg:mt-0 relative overflow-y-visible">
                                <input
                                  name="item_name"
                                  autoComplete="off"
                                  type="text"
                                  className={`${
                                    theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                  } form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                                  id={`itemNameInput-${i}`}
                                  placeholder=""
                                  onChange={handleChangeContent}
                                  onDoubleClick={handleChangeContent}
                                  required
                                />
                                <div
                                  id={`suggestionDiv-${i}`}
                                  className="hidden"
                                >
                                  {suggestions && (
                                    <div className="flex flex-col absolute top-11 z-40">
                                      {suggestions.map((suggestion, k) => (
                                        <button
                                          key={k}
                                          onClick={(e) =>
                                            handleSuggestion(
                                              e,
                                              suggestion.product_name,
                                              i
                                            )
                                          }
                                          className="px-4 py-2 bg-primary border border-neutral text-neutral text-left"
                                        >
                                          {suggestion.product_name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="p-3 text-sm text-primary font-bold whitespace-nowrap">
                              <h3 className="lg:hidden">
                                {theme.language === "Bahasa"
                                  ? "Harga (/Unit)"
                                  : "Price (/Unit)"}
                              </h3>
                              <div>
                                <div className="relative mt-2 lg:mt-0 flex">
                                  <input
                                    name="price_per_item"
                                    autoComplete="off"
                                    type="text"
                                    id={`pricePerItemInput-${i}`}
                                    className={`${
                                      theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                    } form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded-l transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                                    placeholder=""
                                    onFocus={(e) => onFocus(e)}
                                    onBlur={(e) => onBlur(e)}
                                    onChange={handleChangeContent}
                                    onDoubleClick={handleChangeContent}
                                    required
                                  />

                                  <label
                                    htmlFor="price_unit"
                                    className="sr-only"
                                  >
                                    Unit Item
                                  </label>
                                  <select
                                    id={`price_unit-${i}`}
                                    name="price_unit"
                                    className={`bg-white px-1 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded-r transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
                                    // ${
                                    //   theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                    // }
                                    onChange={handleChangeContent}
                                    onDoubleClick={handleChangeContent}
                                    required
                                    defaultValue={""}
                                  >
                                    <option disabled value=""></option>
                                    <option value="bh">
                                      {theme.language === "Bahasa"
                                        ? "/bh"
                                        : "/pcs"}
                                    </option>
                                    <option value="ls">
                                      {theme.language === "Bahasa"
                                        ? "/ls"
                                        : "/doz"}
                                    </option>
                                    <option value="grs">
                                      {theme.language === "Bahasa"
                                        ? "/grs"
                                        : "/gro"}
                                    </option>
                                    <option value="dus">
                                      {theme.language === "Bahasa"
                                        ? "/dus"
                                        : "/box"}
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </td>

                            <td className="p-3 mb-2 md:mb-0 text-sm text-primary font-bold whitespace-nowrap">
                              <h3 className="lg:hidden">Total</h3>
                              <div className="mt-2 lg:mt-0">
                                <input
                                  name="total"
                                  autoComplete="off"
                                  type="text"
                                  className={`${
                                    theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                  } form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-primary focus:outline-none`}
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
                  {/* add button */}
                  <div className="mt-4 mb-5 text-right mr-1">
                    <button
                      className="group gap-2 h-7 px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
                      onClick={addRow}
                    >
                      <FaPlus size={14} />
                    </button>
                  </div>
                  {/* submit button */}
                  <div className="text-center lg:hidden">
                    <button
                      type="submit"
                      className="group text-sm font-bold gap-2 py-2 px-8 md:px-4 bg-primary text-white hover:opacity-80 transition duration-700 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </LayoutIn>
  );
};

export default AddInvoice;

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
