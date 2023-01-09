import React, { useState, useContext, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { getSession, useSession, signOut } from "next-auth/react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "../../components/Sidebar";

import { IoArrowBackOutline } from "react-icons/io5";

import ReactLoading from "react-loading";

export default function editCustomer() {
  // auth
  const { data: session } = useSession();

  function handleSignOut() {
    signOut();
  }

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

  // handle form data
  const [data, setData] = useState();

  // set default form data from the existing data
  useEffect(() => {
    if (customer) {
      setData({
        name: customer.name,
        phone_no: customer.phone_no,
        email: customer.email,
        address: customer.address,
        remarks: customer.remarks,
      });
    }
  }, [customer]);

  // when data changes
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  // handle submit form data
  const submitForm = (e) => {
    e.preventDefault();

    var jsonData = {
      name: data.name,
      phone_no: data.phone_no,
      email: data.email,
      address: data.address,
      remarks: data.remarks,
    };

    // Send data to the backend via POST
    fetch(`http://localhost:3000/api/customers/${customer._id}`, {
      method: "PUT",
      mode: "cors",
      body: JSON.stringify(jsonData),
    }).then((response) => {
      if (response.status === 200) {
        window.location.href = `/customers/${customer._id}`;
      } else {
        setErrorMsg("Failed to Edit Customer! Try Again!");
      }
    });

    // console.log(jsonData);
  };

  return (
    <>
      <Head>
        <title>Edit Customer Form</title>
      </Head>

      <section className="flex w-full">
        <Sidebar handleSignOut={handleSignOut} />

        <main className="container py-12 mx-10 md:mx-14">
          {/* header section */}
          <div className="flex md:items-center justify-between flex-col md:flex-row gap-6 md:gap-0 w-fit md:w-full mb-10">
            <div className="flex items-center gap-8">
              <Link
                className="group flex items-center text-sm font-bold gap-2 py-2 px-4 bg-[#0E3658] text-white hover:opacity-80 transition duration-700 rounded-md"
                href={`/customers/${router.query.id}`}
              >
                <div>
                  {React.createElement(IoArrowBackOutline, { size: "12" })}
                </div>
                <h2 className="whitespace-pre">Back</h2>
              </Link>
              <h3 className="text-3xl md:text-4xl font-bold">
                Edit Customer Form
              </h3>
            </div>

            <hr className="md:hidden" />
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
                          htmlFor="name"
                          className="form-label inline-block mb-2"
                        >
                          Customer Name:
                        </label>
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="name"
                          id="name"
                          placeholder="Enter Customer Name"
                          onChange={handleChange}
                          required
                          defaultValue={data.name ? data.name : "-"}
                        />
                      </div>

                      {/* Phone No */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="phone_no"
                          className="form-label inline-block mb-2"
                        >
                          Phone No:
                        </label>
                        <input
                          autoComplete="off"
                          type="text"
                          className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="phone_no"
                          id="phone_no"
                          placeholder="Enter Phone No"
                          onChange={handleChange}
                          required
                          defaultValue={data.phone_no ? data.phone_no : "-"}
                        />
                      </div>

                      {/* Email */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="email"
                          className="form-label inline-block mb-2"
                        >
                          Email:
                        </label>
                        <input
                          autoComplete="off"
                          type="email"
                          className="form-control block w-full px-3 py-1.5 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="email"
                          id="email"
                          placeholder="Enter Email"
                          onChange={handleChange}
                          required
                          defaultValue={data.email ? data.email : "-"}
                        />
                      </div>
                    </div>

                    {/* top center */}
                    {/* notes */}
                    <div>
                      {/* Address */}
                      <div className="form-group mb-6">
                        <label
                          htmlFor="address"
                          className="form-label inline-block mb-2"
                        >
                          Address:
                        </label>
                        <textarea
                          autoComplete="off"
                          type="text"
                          className="form-control block px-3 py-1.5 w-full md:w-96 h-32 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="address"
                          id="address"
                          placeholder="Enter Address"
                          onChange={handleChange}
                          required
                          defaultValue={data.address ? data.address : "-"}
                        ></textarea>
                      </div>
                    </div>

                    {/* top right */}
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
                          className="form-control block px-3 py-1.5 w-full md:w-96 h-32 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-[#0E3658] focus:outline-none"
                          name="remarks"
                          id="remarks"
                          placeholder="Enter Remarks"
                          onChange={handleChange}
                          defaultValue={data.remarks ? data.remarks : "-"}
                        ></textarea>
                      </div>
                    </div>
                  </div>
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
