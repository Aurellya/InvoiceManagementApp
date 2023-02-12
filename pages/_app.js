import "../styles/globals.css";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeContext } from "../context/ThemeContext";

function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState("Bahasa");
  const [currency, setCurrency] = useState("Rupiah");

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeContext.Provider
        value={{ dark, setDark, language, setLanguage, currency, setCurrency }}
      >
        <div className={`${dark ? "bg-primary text-white" : ""}`}>
          <Component {...pageProps} />
        </div>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
