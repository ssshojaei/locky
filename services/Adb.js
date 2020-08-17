const { exec } = require("shelljs");
const config = require("electron-json-config");

const isConnected = (uuid) => {
  const result = exec(`adb -s ${uuid} shell getprop ro.serialno`).toString();
  result === uuid ? true : false;
};

const Check = (uuid, delay) => {
  setInterval(() => {
    if (!isConnected(uuid)) {
      const command = config.get("configs.lock_command");
      exec(command);
    } else {
      const command = config.get("configs.unlock_command");
      exec(command);
    }
  }, delay);
};

module.exports = { isConnected, Check };
