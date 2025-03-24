import { useGoogleLogin } from "@react-oauth/google";

import { jwtDecode } from "jwt-decode";

const CheckAuthV2 = () => {
  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (codeResponse) => {
      console.log("Decode", jwtDecode(codeResponse.access_token));
      console.log("s", codeResponse);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return <button onClick={() => googleLogin()}>Login</button>;
};

export default CheckAuthV2;
