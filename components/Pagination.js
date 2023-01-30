import React, { useContext } from "react";
import _ from "lodash";
import { ThemeContext } from "../context/ThemeContext";

export default function Pagination({
  items,
  pageSize,
  currentPage,
  onPageChange,
}) {
  // theme
  const theme = useContext(ThemeContext);

  const pageCount = items / pageSize;
  if (Math.ceil(pageCount) === 1) return null;
  const pages = _.range(1, pageCount + 1);

  return (
    <div className="flex items-center justify-center pt-12 pb-4 lg:px-0 sm:px-6 px-4">
      <div
        className={`lg:w-3/5 w-full flex items-center justify-between border-t ${
          theme.dark ? "border-neutral" : "border-[#0E3658]"
        }`}
      >
        <div
          className={`flex items-center pt-3 cursor-pointer ${
            theme.dark
              ? "text-neutral hover:opacity-70"
              : "text-gray-300 hover:text-[#0E3658]"
          }`}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.1665 4L4.49984 7.33333"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.1665 4.00002L4.49984 0.666687"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-sm ml-3 font-medium leading-none ">
            {theme.language === "Bahasa" ? "Sebelumnya" : "Previous"}
          </p>
        </div>
        <div className="sm:flex hidden">
          {pages.map((page) => (
            <button
              onClick={() => onPageChange(page)}
              key={page}
              className={`text-sm font-medium leading-none cursor-pointer border-t pt-3 mr-4 px-2 ${
                page === currentPage
                  ? theme.dark
                    ? "text-neutral border-neutral"
                    : "text-[#0E3658] border-[#0E3658]"
                  : theme.dark
                  ? "text-neutral hover:opacity-70 border-transparent hover:border-[#0E3658]"
                  : "text-gray-300 hover:text-[#0E3658] border-transparent hover:border-[#0E3658]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        <div
          className={`flex items-center pt-3 cursor-pointer ${
            theme.dark
              ? "text-neutral hover:opacity-70"
              : "text-gray-300 hover:text-[#0E3658]"
          }`}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <p className="text-sm font-medium leading-none mr-3">
            {theme.language === "Bahasa" ? "Berikutnya" : "Next"}
          </p>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 7.33333L12.8333 4"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 0.666687L12.8333 4.00002"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
