import axios from "axios";
import { API } from "@/lib/constants";

export const _axios = axios.create({
  baseURL: API,
  withCredentials: true,
});
