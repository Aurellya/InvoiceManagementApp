import "../styles/globals.css";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeContext } from "../context/ThemeContext";

function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeContext.Provider value={{ dark, setDark, language, setLanguage }}>
        <div className={`${dark ? "bg-[#002140] text-white" : ""}`}>
          <Component {...pageProps} />
        </div>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
