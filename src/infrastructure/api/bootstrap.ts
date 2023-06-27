import dotenv from "dotenv";
import debug from "debug";
import { APP_NAME } from "@/core/utils/logger";

dotenv.config();

if (!process.env.DEBUG)
  debug.enable(`${APP_NAME}:info*,${APP_NAME}:error*,${APP_NAME}:warn*`);
