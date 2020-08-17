import { remote } from "electron";
const { require } = remote;
const { exec } = require("shelljs");

export default () => {
  const ips = exec("hostname  -i").toString();
  const ip = ips.split(" ")[0];
  return ip;
};
