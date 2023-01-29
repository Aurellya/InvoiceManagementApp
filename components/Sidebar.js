import React, { useState, useContext } from "react";
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line, RiFileList3Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
import { VscSignOut } from "react-icons/vsc";
import { IoMdContacts } from "react-icons/io";
import Link from "next/link";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar({ handleSignOut }) {
  const menus = [
    { name: "Dashboard", link: "/", icon: MdOutlineDashboard },
    { name: "Invoices", link: "/invoices", icon: TbReportAnalytics },
    { name: "Customers", link: "/customers", icon: IoMdContacts },
    { name: "Price List", link: "/priceList", icon: RiFileList3Line },
    { name: "Settings", link: "/settings", icon: RiSettings4Line },
    { name: "Profile", link: "/profile", icon: AiOutlineUser, margin: true },
  ];

  const menus_b = [
    { name: "Dasbor", link: "/", icon: MdOutlineDashboard },
    { name: "Nota", link: "/invoices", icon: TbReportAnalytics },
    { name: "Pelanggan", link: "/customers", icon: IoMdContacts },
    { name: "Daftar Harga", link: "/priceList", icon: RiFileList3Line },
    { name: "Pengaturan", link: "/settings", icon: RiSettings4Line },
    { name: "Profil", link: "/profile", icon: AiOutlineUser, margin: true },
  ];

  const [open, setOpen] = useState(false);

  const theme = useContext(ThemeContext);

  return (
    <div
      className={`bg-primary min-h-screen ${
        open ? "w-72" : "w-16"
      } duration-500 text-gray-100 px-4`}
    >
      <div className="py-3 flex justify-end">
        <HiMenuAlt3
          size={26}
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>
      <div className="mt-4 flex flex-col gap-4 relative z-50">
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
          className={`group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-secondary rounded-md`}
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
            } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
          >
            {theme.language === "Bahasa" ? "Keluar" : "Sign Out"}
          </h2>
        </button>
      </div>
    </div>
  );
}
