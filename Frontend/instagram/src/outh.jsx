import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const CheckAuth = ({ onLoginSuccess }) => {
  console.log("Login", onLoginSuccess);
  return (
    <GoogleLogin
      useOneTap={false}
      text="signin"
      onSuccess={(credentialResponse) => {
        console.log("Correct Login", credentialResponse);
        console.log("JWTDECODE", jwtDecode(credentialResponse.credential));
        onLoginSuccess(jwtDecode(credentialResponse.credential));
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  );
};

export default CheckAuth;
