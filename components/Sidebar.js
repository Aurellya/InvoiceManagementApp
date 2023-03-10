import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";

import { ThemeContext } from "../context/ThemeContext";

import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line, RiFileList3Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineQrcode } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { IoMdContacts } from "react-icons/io";

export default function Sidebar({ handleSignOut, role }) {
  //theme
  const theme = useContext(ThemeContext);

  const [menus, setMenus] = useState();
  const [menus_b, setMenus_b] = useState();

  useEffect(() => {
    if (role == "admin") {
      setMenus([
        { name: "Dashboard", link: "/", icon: MdOutlineDashboard },
        { name: "Invoices", link: "/invoices", icon: TbReportAnalytics },
        { name: "Customers", link: "/customers", icon: IoMdContacts },
        { name: "Price List", link: "/priceList", icon: RiFileList3Line },
        {
          name: "Company Code",
          link: "/companyCode",
          icon: AiOutlineQrcode,
        },
        {
          name: "Profile",
          link: "/profile",
          icon: AiOutlineUser,
          margin: true,
        },
        { name: "Settings", link: "/settings", icon: RiSettings4Line },
      ]);

      setMenus_b([
        { name: "Dasbor", link: "/", icon: MdOutlineDashboard },
        { name: "Nota", link: "/invoices", icon: TbReportAnalytics },
        { name: "Pelanggan", link: "/customers", icon: IoMdContacts },
        { name: "Daftar Harga", link: "/priceList", icon: RiFileList3Line },
        {
          name: "Kode Perusahaan",
          link: "/companyCode",
          icon: AiOutlineQrcode,
        },
        { name: "Profil", link: "/profile", icon: AiOutlineUser, margin: true },
        { name: "Pengaturan", link: "/settings", icon: RiSettings4Line },
      ]);
    } else if ((role = "staff")) {
      setMenus([
        { name: "Dashboard", link: "/", icon: MdOutlineDashboard },
        { name: "Invoices", link: "/invoices", icon: TbReportAnalytics },
        { name: "Customers", link: "/customers", icon: IoMdContacts },
        { name: "Price List", link: "/priceList", icon: RiFileList3Line },
        {
          name: "Profile",
          link: "/profile",
          icon: AiOutlineUser,
          margin: true,
        },
        { name: "Settings", link: "/settings", icon: RiSettings4Line },
      ]);

      setMenus_b([
        { name: "Dasbor", link: "/", icon: MdOutlineDashboard },
        { name: "Nota", link: "/invoices", icon: TbReportAnalytics },
        { name: "Pelanggan", link: "/customers", icon: IoMdContacts },
        { name: "Daftar Harga", link: "/priceList", icon: RiFileList3Line },
        { name: "Profil", link: "/profile", icon: AiOutlineUser, margin: true },
        { name: "Pengaturan", link: "/settings", icon: RiSettings4Line },
      ]);
    }
  }, []);

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={`${theme.dark ? "shadow-lg" : ""}  ${
          open ? " md:w-72" : " md:w-16"
        } fixed z-50 md:relative w-screen md:min-h-screen md:duration-500 bg-primary text-gray-100 px-4`}
      >
        <div
          className={`py-3 flex ${
            open ? " justify-end" : " justify-start"
          } md:justify-end`}
        >
          <HiMenuAlt3
            size={26}
            className="cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div
          className={`${
            open ? "flex" : "hidden"
          } " mt-4 md:flex flex-col gap-4 relative z-50`}
        >
          {(theme.language === "Bahasa" ? menus_b : menus)?.map((menu, i) => (
            <Link
              href={menu?.link}
              key={i}
              className={` ${
                menu?.margin && "mt-5"
              } group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-secondary rounded-md`}
            >
              <div>{React.createElement(menu?.icon, { size: "20" })}</div>
              <h2
                style={{
                  transitionDelay: `${i + 3}00ms`,
                }}
                className={`whitespace-pre duration-500 ${
                  !open && "opacity-0 translate-x-28 overflow-hidden"
                }`}
              >
                {menu?.name}
              </h2>
              <h2
                className={`${
                  open && "hidden"
                } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
              >
                {menu?.name}
              </h2>
            </Link>
          ))}

          {/* sign out button */}
          <button
            onClick={handleSignOut}
            className={`group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-secondary rounded-md mb-6 md:mb-0`}
          >
            <div>{React.createElement(VscSignOut, { size: "20" })}</div>
            <h2
              style={{
                transitionDelay: `${6 + 3}00ms`,
              }}
              className={`whitespace-pre duration-500 ${
                !open && "opacity-0 translate-x-28 overflow-hidden"
              }`}
            >
              {theme.language === "Bahasa" ? "Keluar" : "Sign Out"}
            </h2>
            <h2
              className={`${
                open && "hidden"
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit`}
            >
              {theme.language === "Bahasa" ? "Keluar" : "Sign Out"}
            </h2>
          </button>
        </div>
      </div>
    </>
  );
}
