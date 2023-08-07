import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";

const pythonDefault = `print("Hello world!")`;

const Landing = () => {
  const [code, setCode] = useState(pythonDefault);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);
          document.getElementById('msgCompileSuccessOrFail').innerHTML = `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`;
        }
        setProcessing(false);
        console.log("catch block...", error);
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        document.getElementById('msgCompileSuccessOrFail').innerHTML = `Compiled Successfully!`
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      document.getElementById('msgCompileSuccessOrFail').innerHTML = `Compiling Failed!`;
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("cobalt").then((_) =>
      setTheme({ value: "cobalt", label: "Cobalt" })
    );
  }, []);

  return (
    <>
      {/*language and theme drop-downs:*/}
      <div class="container-lg">
        <div class="d-flex py-3">
          <div><LanguagesDropdown onSelectChange={onSelectChange} /></div>
          <div class="ps-2"><ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} /></div>
        </div>
      </div>

      {/*Code editor:*/}
      <div class="container">
        <CodeEditorWindow
          code={code}
          onChange={onChange}
          language={language?.value}
          theme={theme.value}
        />
      </div>

      {/*Outputs, custom inputs and :*/}
      <div class="m-1 p-2 d-flex">
        <button
          onClick={handleCompile}
          disabled={!code}
          class="mt-4 border border-gray p-2 fw-bold bg-white flex-shrink-0"
        >
          {processing ? "Processing..." : "Run"}
        </button>
        <div class="container align-self-center">
          <p id="msgCompileSuccessOrFail" class="text-light duration-200"></p>
        </div>
      </div>
      <div class="container">
        <CustomInput
            customInput={customInput}
            setCustomInput={setCustomInput}
          />
      </div>
      <div class="container">
        <OutputWindow outputDetails={outputDetails} />
      </div>
      <div class="container">
        {outputDetails && <OutputDetails outputDetails={outputDetails} />}
      </div>


      {/*<Footer />*/}
    </>
  );
};
export default Landing;
