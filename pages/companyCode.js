import React, { useState, useEffect, useContext } from "react";
import { getSession, useSession } from "next-auth/react";
import ReactLoading from "react-loading";

import { ThemeContext } from "../context/ThemeContext";
import Pagination from "../components/Pagination";
import { paginate } from "../utils/paginate";
import LayoutIn from "../layout/layoutIn";

export default () => {
  const { data: session } = useSession();

  // theme
  const theme = useContext(ThemeContext);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch data or users that need approval
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

  // fetch staff that belong to the group
  const [staff, setStaff] = useState();
  const [loading2, setLoading2] = useState(false);

  const getStaff = async () => {
    setLoading2(true);
    const res = await fetch(
      `http://localhost:3000/api/staffs/${session.group_code}`
    );
    const staffObj = await res.json();
    const staffData = staffObj.data;
    setStaff(staffData);
    setLoading2(false);
  };

  // fetch user info
  const [user, setUser] = useState();

  const getUser = async () => {
    setLoading(true);
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

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  // pagination approval
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

  // function to process the approval/rejection request
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
        setErrorMsg("Failed to Process Request! Try Again!");
      }
    });
  };

  // function to kick staff
  const kickStaff = async (e, staffId) => {
    e.preventDefault();

    var jsonData = {
      staffId: staffId,
    };

    fetch(`http://localhost:3000/api/staffs/${session.group_code}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = "/companyCode";
      } else {
        setErrorMsg("Failed to Kick Staff! Try Again!");
      }
    });
  };

  return (
    <LayoutIn
      title={theme.language === "Bahasa" ? "Kode Perusahaan" : "Company Code"}
      role={session.role}
    >
      <main
        className={`pt-[76px] pb-12 md:py-12 px-8 md:px-14 w-full ${
          loading1 ||
          loading2 ||
          (!loading1 && (!approvalItem || approvalItem.length == 0)) ||
          (!loading2 && (!staff || staff.length == 0))
            ? "md:w-full"
            : "md:w-auto"
        } lg:w-full max-w-[1536px]`}
      >
        {/* header section */}
        <div
          className={`flex md:items-center justify-between w-full ${
            errorMsg ? "md:mb-8" : "md:mb-12"
          }`}
        >
          <div>
            <h3 className="text-3xl md:text-4xl font-bold">
              {theme.language === "Bahasa" ? "Kode Perusahaan" : "Company Code"}
            </h3>
          </div>
        </div>

        {/* error msg */}
        {errorMsg != "" && (
          <div
            className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 md:mt-0 md:mb-8"
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

          {!loading && user && (
            <>
              {/* current group details */}
              <div className="pt-3 px-2">
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
                  <b>{theme.language === "Bahasa" ? "Peran: " : "Role: "}</b>
                  <br />
                  {user.role}
                </h5>

                <br />
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

                  {!loading1 && (!approvalItem || approvalItem.length == 0) && (
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

                  {!loading1 && approvalItem && approvalItem.length > 0 && (
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

                      {/* mobile view */}
                      {paginateItems && (
                        <h2 className="text-sm md:hidden text-right">
                          <span className="font-bold">Total: </span>
                          {paginateItems.length}{" "}
                          {theme.language === "Bahasa"
                            ? "Item"
                            : paginateItems.length > 1
                            ? "Items"
                            : "Item"}
                        </h2>
                      )}
                      <br className="md:hidden" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                        {paginateItems &&
                          paginateItems.map((item) => (
                            <div
                              className={`${
                                theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                              } text-gray-700 space-y-3 p-4 pb-6 rounded-lg shadow`}
                              key={item._id.toString()}
                            >
                              <div className="text-sm font-medium break-words">
                                <b>Id:</b>
                                <br />
                                {item._id}
                              </div>

                              <div className="text-sm font-medium">
                                <b>
                                  {theme.language === "Bahasa"
                                    ? "Nama Pemohon:"
                                    : "Applicant's Username:"}
                                </b>
                                <br />
                                {item.applicantId.username}
                              </div>

                              <div className="text-sm font-medium">
                                <b>
                                  {theme.language === "Bahasa"
                                    ? "Email Pemohon:"
                                    : "Applicant's Email:"}
                                </b>
                                <br />
                                {item.applicantId.email}
                              </div>

                              <hr />

                              <div className="flex justify-between pt-3">
                                <button
                                  onClick={(e) =>
                                    processReq(
                                      e,
                                      "approve",
                                      item.applicantId._id,
                                      item._id
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
                                <button
                                  onClick={(e) =>
                                    processReq(
                                      e,
                                      "reject",
                                      item.applicantId._id,
                                      item._id
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
                              </div>
                            </div>
                          ))}
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

                  {!loading2 && (!staff || staff.length == 0) && (
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

                  {!loading2 && staff && staff.length > 0 && (
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
                                      theme.dark ? "!bg-[#99AEBA]" : "bg-white"
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

                      {/* mobile view */}
                      {paginateStaff && (
                        <h2 className="text-sm md:hidden text-right">
                          <span className="font-bold">Total: </span>
                          {paginateStaff.length}{" "}
                          {theme.language === "Bahasa"
                            ? "Karyawan"
                            : paginateStaff.length > 1
                            ? "Staffs"
                            : "Staff"}
                        </h2>
                      )}
                      <br className="md:hidden" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
                        {paginateStaff &&
                          paginateStaff.map((_staff) => (
                            <div
                              className={`${
                                theme.dark ? "!bg-[#99AEBA]" : "bg-white"
                              } text-gray-700 space-y-3 p-4 pb-6 rounded-lg shadow`}
                              key={_staff._id.toString()}
                            >
                              <div className="text-sm font-medium break-words">
                                <b>Staff Id:</b>
                                <br />
                                {_staff._id}
                              </div>

                              <div className="text-sm font-medium">
                                <b>
                                  {theme.language === "Bahasa"
                                    ? "Nama Pengguna"
                                    : "Username"}
                                </b>
                                <br />
                                {_staff.username}
                              </div>

                              <div className="text-sm font-medium">
                                <b>Email</b>
                                <br />
                                {_staff.email}
                              </div>

                              <hr />

                              <div className="flex justify-end pt-3">
                                <button
                                  onClick={(e) => kickStaff(e, _staff._id)}
                                  className="group button-custom bg-[#F44645]"
                                >
                                  <h2 className="whitespace-pre">
                                    {theme.language === "Bahasa"
                                      ? "Keluarkan"
                                      : "Kick"}
                                  </h2>
                                </button>
                              </div>
                            </div>
                          ))}
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
