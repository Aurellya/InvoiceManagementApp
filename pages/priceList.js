import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../context/ThemeContext";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";
import LayoutIn from "../layout/layoutIn";

import { BsPlusLg } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";

export default () => {
  // session
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [priceLists, setPriceLists] = useState();
  const [loading, setLoading] = useState(false);

  const getPriceLists = async () => {
    setLoading(true);
    const res = await fetch(
      `http://localhost:3000/api/mypricelists/${session.group_code}`
    );
    const priceListsObj = await res.json();
    const priceLists = priceListsObj.data;
    setPriceLists(priceLists);
    setLoading(false);
  };

  useEffect(() => {
    getPriceLists();
  }, []);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    if (page <= Math.ceil(priceLists.length / pageSize) && page > 0) {
      setCurrentPage(page);
    }
  };

  const [paginatePriceLists, setPaginatePriceLists] = useState();

  useEffect(() => {
    if (priceLists) {
      setPaginatePriceLists(paginate(priceLists, currentPage, pageSize));
    }
  }, [priceLists]);

  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    if (priceLists) {
      let filteredPriceLists = priceLists.filter((p) =>
        p.product_name.includes(keyword)
      );
      setPaginatePriceLists(
        paginate(filteredPriceLists, currentPage, pageSize)
      );
    }
  }, [keyword]);

  const search = (e) => {
    e.preventDefault();
    if (document.getElementById("p_name")) {
      setKeyword(document.getElementById("p_name").value);
    }
  };

  return (
    <LayoutIn
      title={theme.language === "Bahasa" ? "Daftar Harga" : "Price List"}
      role={session.role}
    >
      <main
        className={`pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full ${
          loading || (!loading && (!priceLists || priceLists.length == 0))
            ? "md:w-full"
            : "md:w-auto"
        } lg:w-full max-w-[1536px]`}
      >
        {/* header section */}
        <div className="flex md:items-center justify-between flex-col md:flex-row gap-4 md:gap-0 w-full">
          <h3 className="text-3xl md:text-4xl font-bold">
            {theme.language === "Bahasa" ? "Daftar Harga" : "Price List"}
          </h3>
          <hr className="md:hidden" />
          {session && session.role == "admin" && (
            <div className="flex justify-end">
              <Link
                className={`w-fit button-custom mt-0 ${
                  theme.dark ? "bg-dm_secondary" : "bg-primary"
                }`}
                href="/addPriceList"
              >
                <div>{React.createElement(BsPlusLg, { size: "12" })}</div>
                <h2 className="whitespace-pre">
                  {theme.language === "Bahasa" ? "Tambahkan" : "Create New"}
                </h2>
              </Link>
            </div>
          )}
        </div>

        {/* priceLists search bar */}
        <div
          className={`table-div-custom p-6 my-4 md:mt-12 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <h1 className="text-lg md:text-xl mb-4">
            {theme.language === "Bahasa" ? "Bar Pencarian" : "Search Bar"}
          </h1>

          <div className="form-group">
            <div className="flex gap-2">
              <input
                autoComplete="off"
                type="text"
                className={`${
                  theme.dark
                    ? "!bg-dm_secondary text-neutral"
                    : "bg-white border-gray-300 focus:text-gray-700 focus:bg-white focus:border-primary text-gray-700"
                } form-control block w-full md:w-[400px] px-3 py-1.5 font-normal text-gray-700 bg-clip-padding border border-solid rounded transition ease-in-out m-0 focus:outline-none`}
                name="p_name"
                id="p_name"
                placeholder={
                  theme.language === "Bahasa"
                    ? "Masukkan Nama Produk"
                    : "Enter Product Name"
                }
                required
              />
              <button
                onClick={search}
                className={`w-fit button-custom mt-0 ${
                  theme.dark ? "bg-dm_secondary" : "bg-primary"
                }`}
              >
                {React.createElement(AiOutlineSearch, { size: "20" })}
              </button>
            </div>
          </div>
        </div>

        {/* priceLists table */}
        <div
          className={`table-div-custom p-6 my-4 md:mt-8 ${
            theme.dark ? "text-neutral !bg-dm_secondary" : ""
          }`}
        >
          <div className="flex justify-between">
            <h1 className="text-lg md:text-xl mb-4">
              {theme.language === "Bahasa" ? "Rincian Item" : "Item Details"}
            </h1>
            {paginatePriceLists && (
              <h2 className="text-sm hidden md:block">
                <span className="font-bold">Total: </span>
                {paginatePriceLists.length}{" "}
                {theme.language === "Bahasa"
                  ? "Jenis Barang"
                  : paginatePriceLists.length > 1
                  ? "Items"
                  : "Item"}
              </h2>
            )}
          </div>

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

          {!loading && (!priceLists || priceLists.length == 0) && (
            <div className="py-8">
              <div className="mt-9 flex flex-col justify-center items-center">
                <h3 className="text-xl mb-4 font-bold">
                  {theme.language === "Bahasa" ? "Tidak Ada Data" : "No Data"}
                </h3>
              </div>
            </div>
          )}

          {!loading && priceLists && priceLists.length != 0 && (
            <>
              {/* large screen view */}
              <div className="overflow-auto rounded-lg shadow hidden md:block">
                <table className="w-full">
                  <thead
                    className={`${
                      theme.dark ? "bg-primary" : "bg-gray-50 text-gray-700"
                    } border-b-2 border-gray-200`}
                  >
                    <tr>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "ID Barang" : "Item ID."}
                      </th>
                      <th className="p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa"
                          ? "Nama Produk"
                          : "Product Name"}
                      </th>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa"
                          ? "Jumlah (/Unit)"
                          : "Amount (/Unit)"}
                      </th>
                      <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "Harga" : "Price"}
                      </th>
                      {session && session.role == "admin" && (
                        <th className="w-36 p-3 text-sm font-semibold tracking-wide text-left">
                          {theme.language === "Bahasa"
                            ? "Harga VIP"
                            : "VIP Price"}
                        </th>
                      )}

                      <th className="w-52 p-3 text-sm font-semibold tracking-wide text-left">
                        {theme.language === "Bahasa" ? "Keterangan" : "Remarks"}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatePriceLists &&
                      paginatePriceLists.map((item) => (
                        <tr
                          className={`${
                            theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                          } text-gray-700`}
                          key={item._id}
                        >
                          <td className="p-3 text-sm text-primary font-bold whitespace-nowrap">
                            <Link
                              href={`/priceList/${item._id}`}
                              className="transition duration-700 hover:underline"
                            >
                              {item._id}
                            </Link>
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {item.product_name}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {item.amount + " "}
                            {theme.language === "Bahasa"
                              ? item.unit
                              : item.unit == "bh"
                              ? "pcs"
                              : (item.unit = "ls"
                                  ? "doz"
                                  : item.unit == "grs"
                                  ? "gro"
                                  : "box")}
                          </td>
                          <td className="p-3 text-sm whitespace-nowrap">
                            {item.price.toLocaleString("en-US", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            })}
                          </td>
                          {session && session.role == "admin" && (
                            <td className="p-3 text-sm whitespace-nowrap">
                              {item.vip_price
                                ? item.vip_price.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                  })
                                : "-"}
                            </td>
                          )}
                          <td className="p-3 text-sm whitespace-nowrap">
                            {item.remarks
                              ? item.remarks.length > 20
                                ? item.remarks.slice(0, 20) + " ..."
                                : item.remarks
                              : "-"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* mobile view */}
              <hr className="md:hidden" />
              {paginatePriceLists && (
                <h2 className="text-sm md:hidden mt-5 text-right">
                  <span className="font-bold">Total: </span>
                  {paginatePriceLists.length}{" "}
                  {theme.language === "Bahasa"
                    ? "Jenis Barang"
                    : paginatePriceLists.length > 1
                    ? "Items"
                    : "Item"}
                </h2>
              )}
              <br className="md:hidden" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                {paginatePriceLists &&
                  paginatePriceLists.map((item) => (
                    <div
                      className={`${
                        theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                      } text-gray-700 space-y-3 p-4 pb-6 rounded-lg shadow`}
                      key={item._id}
                    >
                      <div className="text-sm font-medium break-words">
                        <b>
                          {theme.language === "Bahasa"
                            ? "ID Barang"
                            : "Item ID."}
                        </b>
                        <br />
                        {item._id}
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Nama Produk: "
                            : "Product Name: "}
                        </b>
                        {item.product_name}
                      </div>
                      <hr />
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Jumlah (/Unit): "
                            : "Amount (/Unit): "}
                        </b>
                        {item.amount + " "}{" "}
                        {theme.language === "Bahasa"
                          ? item.unit
                          : item.unit == "bh"
                          ? "pcs"
                          : item.unit == "ls"
                          ? "doz"
                          : item.unit == "grs"
                          ? "gro"
                          : "box"}
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa" ? "Harga: " : "Price: "}
                        </b>
                        <span className="text-sm font-medium">
                          {item.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Harga VIP: "
                            : "VIP Price: "}
                        </b>
                        <span className="text-sm font-medium">
                          {item.vip_price
                            ? item.vip_price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "IDR",
                                maximumFractionDigits: 0,
                              })
                            : "-"}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        <b>
                          {theme.language === "Bahasa"
                            ? "Keterangan: "
                            : "Remarks: "}
                        </b>
                        {item.remarks
                          ? item.remarks.length > 20
                            ? item.remarks.slice(0, 20) + " ..."
                            : item.remarks
                          : "-"}
                      </div>

                      <div className="text-center pt-5">
                        <Link
                          className="py-2 px-5 text-xs font-medium uppercase tracking-wider rounded-md bg-tertiary text-white"
                          href={`/priceList/${item._id}`}
                        >
                          {theme.language === "Bahasa"
                            ? "Lihat Rincian"
                            : "View Details"}
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>

              <Pagination
                items={priceLists.length}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>
    </LayoutIn>
  );
};

export async function getServerSideProps({ req }) {
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
