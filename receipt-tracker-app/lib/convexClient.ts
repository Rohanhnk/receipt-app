import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

//Create a Convex client for sercer-side actions
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convex;
