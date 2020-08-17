import { remote } from "electron";
const { require } = remote;
const { exec } = require("shelljs");

const format = (string) => {
  string = string.split("\n");
  string.pop();
  const temp = [];

  string.forEach((item) => {
    let value = item.replace("Device ", "");
    temp.push({
      macAddress: value.substring(0, 17),
      name: value.substring(18),
    });
  });
  return temp;
};

export const getDevices = () => {
  exec("bluetoothctl scan on", { async: true, silent: true });
  const list = exec("bluetoothctl devices").toString();
  return format(list);
};

export const isConnected = (mac) => {
  let info = exec(`bluetoothctl info ${mac} | grep 'Connected'`).toString();
  try {
    return info.split(":")[1].trim() === "yes" ? true : false;
  } catch (error) {
    return false;
  }
};

export const connect = async (mac) => {
  const pair = await exec(`bluetoothctl pair ${mac}`, {
    async: true,
  }).toString();
  const connect = await exec(`bluetoothctl connect ${mac}`, {
    async: true,
  }).toString();
  return [pair, connect];
};

export const disconnect = async (mac) => {
  const remove = await exec(`bluetoothctl remove ${mac}`, {
    async: true,
  }).toString();
  return remove;
};
