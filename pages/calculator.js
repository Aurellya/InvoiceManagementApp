import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Calculator.module.css";
import { ThemeContext } from "../context/ThemeContext";

export default ({ closeCalculator }) => {
  // theme
  const theme = useContext(ThemeContext);

  const [num, setNum] = useState(0);
  const [oldNum, setOldNum] = useState(0);
  const [operator, setOperator] = useState();

  function inputNum(e) {
    let input = e.target.value;
    if (num === 0) {
      setNum(input);
    } else {
      setNum(num + input);
    }
  }

  function clear() {
    setNum(0);
  }

  function percentage() {
    setNum(num / 100);
  }

  function changeSign() {
    if (num > 0) {
      setNum(-num);
    } else {
      setNum(Math.abs(num));
    }
  }

  function operatorHandler(e) {
    let operatorInput = e.target.value;
    setOperator(operatorInput);
    setOldNum(num);
    setNum(0);
  }

  function calculate() {
    let result = 0;
    if (operator === "/") {
      result = parseFloat(oldNum) / parseFloat(num);
    } else if (operator === "X" || operator === "x") {
      result = parseFloat(oldNum) * parseFloat(num);
    } else if (operator === "-") {
      result = parseFloat(oldNum) - parseFloat(num);
    } else if (operator === "+") {
      result = parseFloat(oldNum) + parseFloat(num);
    }
    setNum(result);
  }

  // onkeypress listener
  const [tempKey, setTempKey] = useState();
  const [key, setKey] = useState();

  function updateVal(val) {
    if (val) {
      if (/\d/.test(val) || val === ".") {
        if (num === 0) {
          setNum(val);
        } else {
          setNum(num + val);
        }
      } else if (
        val == "X" ||
        val == "x" ||
        val == "/" ||
        val == "+" ||
        val == "-"
      ) {
        setOperator(val);
        setOldNum(num);
        setNum(0);
      } else if (val === "Enter" || val === "=") {
        calculate();
      } else if (val === "%") {
        percentage();
      } else if (val === "Backspace") {
        if (num.toString().length <= 1) {
          setNum(0);
        } else {
          setNum(Math.floor(num / 10));
        }
      }
    }
  }

  useEffect(() => {
    function onKeydown(e) {
      e.preventDefault();
      setTempKey(e.key);
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    if (tempKey) {
      setKey(tempKey);
      setTempKey("none");
    }
  }, [tempKey]);

  useEffect(() => {
    updateVal(key);
  }, [key]);

  return (
    <div className="bg-white px-10 py-8 rounded-md text-center w-[600px] relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={closeCalculator}
          className="flex items-center font-bold py-1 px-4 bg-[#F44645] text-white hover:opacity-80 transition duration-700 rounded"
        >
          x
        </button>
      </div>

      <h1 className="text-xl mb-6 font-bold">
        {theme.language === "Bahasa" ? "Kalkulator" : "Calculator"}
      </h1>

      <div className="wrapper">
        <div className="w-full border py-2 px-2 mb-8">
          <h1 className="resultado text-[1.5em]">{num}</h1>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <button
            className={`col-span-3 border border-black ${styles.button}`}
            onClick={clear}
          >
            AC
          </button>
          <button
            className={`col-span-3 border border-black ${styles.button}`}
            onClick={changeSign}
          >
            +/-
          </button>
          <button
            className={`col-span-3 border border-black ${styles.button}`}
            onClick={percentage}
          >
            %
          </button>
          <button
            className={`bg-orange-500 col-span-3 ${styles.button}`}
            onClick={operatorHandler}
            value={"/"}
          >
            /
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={7}
          >
            7
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={8}
          >
            8
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={9}
          >
            9
          </button>
          <button
            className={`bg-orange-500 col-span-3 ${styles.button}`}
            onClick={operatorHandler}
            value={"X"}
          >
            X
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={4}
          >
            4
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={5}
          >
            5
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={6}
          >
            6
          </button>
          <button
            className={`bg-orange-500 col-span-3 ${styles.button}`}
            onClick={operatorHandler}
            value={"-"}
          >
            -
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={1}
          >
            1
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={2}
          >
            2
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={3}
          >
            3
          </button>
          <button
            className={`bg-orange-500 col-span-3 ${styles.button}`}
            onClick={operatorHandler}
            value={"+"}
          >
            +
          </button>
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={0}
          >
            0
          </button>
          {/* <button style={{ visibility: "hidden" }}>k</button>{" "} */}
          <button
            className={`bg-gray-300 col-span-3 ${styles.button}`}
            onClick={inputNum}
            value={"."}
          >
            .
          </button>
          <button
            className={`bg-orange-500 col-span-6 ${styles.button}`}
            onClick={calculate}
          >
            =
          </button>
        </div>
      </div>
    </div>
  );
};
