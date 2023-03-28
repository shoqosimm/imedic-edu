import axios from "axios";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: "https://api.edu.imedic.uz/",
});

// request for all api's
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access_token");
    config.headers = {
      Authorization: `Bearer ${access}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...config.headers,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response for all api's
api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (!error.response) {
      error["response"] = {
        data: {
          errors: [
            {
              message:
                "Проверьте подключение к Интернету или Сервер не отвечает",
            },
          ],
        },
      };

      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else if (error.response.status === 400) {
      toast.warn(error?.response.data?.data.messages.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error(error?.response.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }
);
