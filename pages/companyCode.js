import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession, useSession, signOut } from "next-auth/react";
import ReactLoading from "react-loading";

import Sidebar from "../components/Sidebar";
import { ThemeContext } from "../context/ThemeContext";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";

import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdAddToHomeScreen } from "react-icons/md";

export default () => {
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

  // theme
  const theme = useContext(ThemeContext);

  // fetch data
  const [approvalItem, setApprovalItem] = useState();
  const [loading1, setLoading1] = useState(false);

  const getItems = async () => {
    setLoading1(true);
    const res = await fetch(
      `http://localhost:3000/api/approval/${session.group_code}`
    );
    const itemsObj = await res.json();
    const items = itemsObj.data;
    setApprovalItem(items);
    setLoading1(false);
  };

  const [staff, setStaff] = useState();
  const [loading2, setLoading2] = useState(false);

  const getStaff = async () => {
    setLoading2(true);
    const res = await fetch(
      `http://localhost:3000/api/members/${session.group_code}`
    );
    const staffObj = await res.json();
    const staffData = staffObj.data;
    setStaff(staffData);
    setLoading2(false);
  };

  const [user, setUser] = useState();

  const getUser = async () => {
    const res = await fetch(`http://localhost:3000/api/profile/${session._id}`);
    const profileObj = await res.json();
    const profileData = await profileObj.data;
    setUser(profileData);
  };

  useEffect(() => {
    getUser();
    getItems();
    getStaff();
  }, []);

  // pagination
  const pageSize = 10;

  const [currentPage1, setCurrentPage1] = useState(1);
  const handlePageChange1 = (page) => {
    if (page <= Math.ceil(approvalItem.length / pageSize) && page > 0) {
      setCurrentPage1(page);
    }
  };
  const paginateItems = paginate(approvalItem, currentPage1, pageSize);

  // pagination staff
  const [currentPage2, setCurrentPage2] = useState(1);
  const handlePageChange2 = (page) => {
    if (page <= Math.ceil(staff.length / pageSize) && page > 0) {
      setCurrentPage2(page);
    }
  };
  const paginateStaff = paginate(staff, currentPage2, pageSize);

  // function to process the approval request
  const processReq = (e, status, staffId, approvalId) => {
    e.preventDefault();

    var jsonData = {
      status: status,
      applicantId: staffId,
      group_code: session.group_code,
    };

    fetch(`http://localhost:3000/api/approvalItem/${approvalId}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = "/companyCode";
      } else {
        console.log("Failed to Process Request! Try Again!");
        // setErrorMsg("Failed to Kick Staff! Try Again!");
      }
    });
  };

  // function to kick staff
  const kickStaff = async (e, staffId) => {
    e.preventDefault();

    var jsonData = {
      staffId: staffId,
    };

    fetch(`http://localhost:3000/api/members/${session.group_code}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = "/companyCode";
      } else {
        console.log("Failed to Kick Staff! Try Again!");
        // setErrorMsg("Failed to Kick Staff! Try Again!");
      }
    });
  };

  return (
    <>
      <Head>
        <title>
          {theme.language === "Bahasa" ? "Kode Perusahaan" : "Company Code"}
        </title>
      </Head>

      <section className="flex">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between w-full md:mb-12">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold">
                {theme.language === "Bahasa"
                  ? "Kode Perusahaan"
                  : "Company Code"}
              </h3>
            </div>
          </div>

          {/* content */}
          <div
            className={`table-div-custom my-4 md:my-0 p-6 block mb-4 md:mb-0 ${
              theme.dark ? "text-neutral !bg-dm_secondary" : ""
            }`}
          >
            <div>
              <h1 className="text-lg md:text-xl mb-3">
                {theme.language === "Bahasa"
                  ? "Rincian Grup Terkini"
                  : "Current Group Details"}
              </h1>
            </div>

            <hr />
            <br />

            {user && (
              <>
                {/* current group details */}
                <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-10 pb-0 md:pb-0 pt-3">
                  <div className="flex flex-col lg:flex-row md:mt-[40px] lg:mt-0 lg:col-span-8">
                    <div className="md:col-span-8 h-fit mt-8 md:mt-0 w-full">
                      <h5>
                        <b>
                          {theme.language === "Bahasa"
                            ? "Kode Perusahaan: "
                            : "Company Code: "}
                        </b>
                        <br />
                        {user.group_code}
                      </h5>

                      <br />

                      <h5>
                        <b>
                          {theme.language === "Bahasa" ? "Peran: " : "Role: "}
                        </b>
                        <br />
                        {user.role}
                      </h5>

                      <br />
                    </div>
                  </div>
                </div>

                {/* approval req table */}
                {user.role == "admin" && (
                  <>
                    <div>
                      <h1 className="text-lg md:text-xl mb-3 mt-8">
                        {theme.language === "Bahasa"
                          ? "Permintaan Persetujuan"
                          : "Approval Request"}
                      </h1>
                    </div>

                    <hr />
                    <br />

                    {loading1 && (
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

                    {!loading1 &&
                      (!approvalItem || approvalItem.length == 0) && (
                        <div className="py-8">
                          <div className="mt-9 flex flex-col justify-center items-center">
                            <h3 className="text-xl mb-4 font-bold">
                              {theme.language === "Bahasa"
                                ? "Tidak Ada Data"
                                : "No Data"}
                            </h3>
                          </div>
                        </div>
                      )}

                    {!loading1 && approvalItem && approvalItem.length != 0 && (
                      <div>
                        {/* large screen view */}
                        <div className="overflow-auto shadow hidden md:block">
                          <table className="w-full">
                            <thead
                              className={`${
                                theme.dark
                                  ? "bg-primary"
                                  : "bg-gray-50 text-gray-700"
                              } border-b-2 border-gray-200`}
                            >
                              <tr>
                                <th className="w-72 p-3 text-sm font-semibold tracking-wide text-left">
                                  Id
                                </th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                                  {theme.language === "Bahasa"
                                    ? "Nama Pemohon"
                                    : "Applicant's Username"}
                                </th>
                                <th className="w-80 p-3 text-sm font-semibold tracking-wide text-left">
                                  {theme.language === "Bahasa"
                                    ? "Email Pemohon"
                                    : "Applicant's Email"}
                                </th>
                                <th className="w-36 p-3 text-sm font-semibold tracking-wide text-center"></th>
                                <th className="w-36 p-3 text-sm font-semibold tracking-wide text-center"></th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                              {paginateItems.map((app) => (
                                <tr
                                  className={`${
                                    theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                                  } text-gray-700`}
                                  key={app._id.toString()}
                                >
                                  <td className="p-3 text-sm font-bold whitespace-nowrap">
                                    {app._id}
                                  </td>
                                  <td className="p-3 text-sm whitespace-nowrap">
                                    {app.applicantId.username}
                                  </td>
                                  <td className="p-3 text-sm whitespace-nowrap">
                                    {app.applicantId.email}
                                  </td>
                                  <td className="p-3 text-sm whitespace-nowrap">
                                    <button
                                      onClick={(e) =>
                                        processReq(
                                          e,
                                          "approve",
                                          app.applicantId._id,
                                          app._id
                                        )
                                      }
                                      className="group button-custom bg-tertiary"
                                    >
                                      <h2 className="whitespace-pre">
                                        {theme.language === "Bahasa"
                                          ? "Terima"
                                          : "Approve"}
                                      </h2>
                                    </button>
                                  </td>
                                  <td className="p-3 text-sm whitespace-nowrap">
                                    <button
                                      onClick={(e) =>
                                        processReq(
                                          e,
                                          "reject",
                                          app.applicantId._id,
                                          app._id
                                        )
                                      }
                                      className="group button-custom bg-[#F44645]"
                                    >
                                      <h2 className="whitespace-pre">
                                        {theme.language === "Bahasa"
                                          ? "Tolak"
                                          : "Reject"}
                                      </h2>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <Pagination
                          items={approvalItem.length}
                          currentPage={currentPage1}
                          pageSize={pageSize}
                          onPageChange={handlePageChange1}
                        />
                      </div>
                    )}
                  </>
                )}

                {/* staff list table */}
                {user.role == "admin" && (
                  <>
                    <div>
                      <h1 className="text-lg md:text-xl mb-3 mt-12">
                        {theme.language === "Bahasa"
                          ? "Daftar Staff"
                          : "Staff List"}
                      </h1>
                    </div>

                    <hr />
                    <br />

                    {loading2 && (
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

                    {!loading2 && (!staff || staff.length <= 1) && (
                      <div className="py-8">
                        <div className="mt-9 flex flex-col justify-center items-center">
                          <h3 className="text-xl mb-4 font-bold">
                            {theme.language === "Bahasa"
                              ? "Tidak Ada Data"
                              : "No Data"}
                          </h3>
                        </div>
                      </div>
                    )}

                    {!loading2 && staff && staff.length > 1 && (
                      <div>
                        {/* large screen view */}
                        <div className="overflow-auto shadow hidden md:block">
                          <table className="w-full">
                            <thead
                              className={`${
                                theme.dark
                                  ? "bg-primary"
                                  : "bg-gray-50 text-gray-700"
                              } border-b-2 border-gray-200`}
                            >
                              <tr>
                                <th className="w-72 p-3 text-sm font-semibold tracking-wide text-left">
                                  Staff Id
                                </th>
                                <th className="p-3 text-sm font-semibold tracking-wide text-left">
                                  {theme.language === "Bahasa"
                                    ? "Nama Pengguna"
                                    : "Username"}
                                </th>
                                <th className="w-80 p-3 text-sm font-semibold tracking-wide text-left">
                                  Email
                                </th>
                                <th className="w-36 p-3 text-sm font-semibold tracking-wide text-center"></th>
                                <th className="w-36 p-3 text-sm font-semibold tracking-wide text-center"></th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                              {paginateStaff.map(
                                (_staff) =>
                                  _staff._id != session._id && (
                                    <tr
                                      className={`${
                                        theme.dark
                                          ? "!bg-[#99AEBA]"
                                          : "bg-white"
                                      } text-gray-700`}
                                      key={_staff._id.toString()}
                                    >
                                      <td className="p-3 text-sm font-bold whitespace-nowrap">
                                        {_staff._id}
                                      </td>
                                      <td className="p-3 text-sm whitespace-nowrap">
                                        {_staff.username}
                                      </td>
                                      <td className="p-3 text-sm whitespace-nowrap">
                                        {_staff.email}
                                      </td>
                                      <td className="p-3 text-sm whitespace-nowrap"></td>
                                      <td className="p-3 text-sm whitespace-nowrap">
                                        <button
                                          onClick={(e) =>
                                            kickStaff(e, _staff._id)
                                          }
                                          className="group button-custom bg-[#F44645]"
                                        >
                                          <h2 className="whitespace-pre">
                                            {theme.language === "Bahasa"
                                              ? "Keluarkan"
                                              : "Kick"}
                                          </h2>
                                        </button>
                                      </td>
                                    </tr>
                                  )
                              )}
                            </tbody>
                          </table>
                        </div>

                        <Pagination
                          items={staff.length}
                          currentPage={currentPage2}
                          pageSize={pageSize}
                          onPageChange={handlePageChange2}
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>
      </section>
    </>
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