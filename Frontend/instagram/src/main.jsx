import { createRoot } from "react-dom/client";

import InstaUi from "./index";

import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <GoogleOAuthProvider>
      <InstaUi />
    </GoogleOAuthProvider>
  </>
);
