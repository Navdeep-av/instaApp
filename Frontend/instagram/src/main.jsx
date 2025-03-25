import { createRoot } from "react-dom/client";

import InstaUi from "./index";

import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <>
    <GoogleOAuthProvider clientId="482708417538-qrt611obohjpa5sjmrnpsd8esons6fb7.apps.googleusercontent.com">
      <InstaUi />
    </GoogleOAuthProvider>
  </>
);
