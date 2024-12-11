import { Method } from "axios";

import { axiosInstance } from "../../config/axios/axios.config.js";

export const processRequest = async (
  {
    endpoint,
    method,
    headers,
    payload
  }:
    {
      endpoint: string,
      method: Method,
      headers?: object,
      payload?: object
    }): Promise<{
      success: boolean,
      result: any
    }> => {
  try {
    const result = await axiosInstance.request({
      url: endpoint,
      method,
      headers,
      data: payload,
      timeout: 10000
    });

    return {
      success: true,
      result,
    }
  } catch (error: any) {
    console.log("🚀 ~ processRequest:", error?.message || error);
    return {
      success: false,
      result: error
    }
  }
}
