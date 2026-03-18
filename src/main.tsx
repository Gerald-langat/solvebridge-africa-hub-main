import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById("root")!).render(
  <PayPalScriptProvider
    options={{
      "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
      currency: "USD",
      intent: "capture",
    }}
  >
    <App />
  </PayPalScriptProvider>,
);
