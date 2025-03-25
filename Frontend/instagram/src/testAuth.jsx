import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

import { jwtDecode } from "jwt-decode";

const CheckAuthV2 = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: "Bearer <tokenResponse.access_token>" } }
      );

      console.log(userInfo);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return <button onClick={() => googleLogin()}>Login</button>;
};

export default CheckAuthV2;
