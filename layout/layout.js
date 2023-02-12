import React from "react";
import styles from "../styles/Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className="flex bg-[#fff] py-6 md:py-12 min-h-screen">
      <div className="m-auto bg-slate-50 rounded-md w-10/12 md:w-4/5 lg:w-3/5 grid md:grid-cols-2 drop-shadow-md border">
        <div className={styles.imgStyle}>
          <div className={styles.illustrationImg}></div>
        </div>

        <div
          className={`right flex flex-col justify-evenly bg-[#fff] ${styles.imgStyle2}`}
        >
          <div className="text-center py-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
