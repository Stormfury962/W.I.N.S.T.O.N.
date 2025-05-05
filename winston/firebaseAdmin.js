import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync("./winston-71bf1-firebase-adminsdk-fbsvc-1f5f44f879.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;