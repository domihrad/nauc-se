import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./www/dist/css/main.min.css?";
import reportWebVitals from "./reportWebVitals";

/**
 * Globals configuration.
 */
export const Globals =
{
    extensionName : "Nauč-se",
    apiUrl : "http://127.0.0.1:5000",
}


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();
