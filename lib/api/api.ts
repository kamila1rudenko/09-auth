import axios from "axios";
const isBrowser = typeof window !== "undefined";
const SITE = process.env.NEXT_PUBLIC_API_URL!;
export default axios.create({
  baseURL: isBrowser ? "/api" : `${SITE}/api`,
  withCredentials: true,
});
