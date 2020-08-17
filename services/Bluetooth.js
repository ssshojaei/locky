const { exec } = require("shelljs");
const config = require("electron-json-config");

const isConnected = (mac) => {
  let info = exec(`bluetoothctl info ${mac} | grep 'Connected'`).toString();
  try {
    const status = info.split(":")[1].trim() === "yes" ? true : false;
    return status;
  } catch (error) {
    return false;
  }
};

const Bluetooth = (mac, delay) => {
  setInterval(() => {
    if (!isConnected(mac)) {
      const command = config.get("configs.lock_command");
      console.log("lock");
      exec(command);
    } else {
      const command = config.get("configs.unlock_command");
      console.log("unlock");
      exec(command);
    }
  }, delay);
};

module.exports = { Bluetooth };
