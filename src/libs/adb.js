import { remote } from "electron";
const { require } = remote;
const { exec } = require("shelljs");

export const getDevices = () => {
  let result;
  try {
    result = exec(`adb devices -l`);
    result = result.toString();
    result = result.replace("List of devices attached", "");
    result = result.trim();
    result = result.split("\n");
    result = result.map((item) => {
      const info = item.split(" ").filter(Boolean);

      const uuid = info[0];
      const title = info[info.findIndex((value) => /^model:/.test(value))]
        .replace("model:", "")
        .replace(/_/g, " ");

      return {
        uuid,
        title,
      };
    });
  } catch (error) {
    result = [];
  }

  return result;
};

export const isConnected = (uuid) => {
  const result = exec(`adb -s ${uuid} shell getprop ro.serialno`).toString();
  try {
    return result.trim() === uuid ? true : false;
  } catch (error) {
    return false;
  }
};
