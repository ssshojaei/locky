const express = require("express");
const app = express();
const { exec } = require("shelljs");
const config = require("electron-json-config");

const expressApp = (port) => {
  app.get("/lock", (req, res) => {
    const command = config.get("configs.lock_command");
    exec(command);
    res.send("locked");
  });

  app.get("/unlock", (req, res) => {
    const command = config.get("configs.unlock_command");
    exec(command);
    res.send("Unlocked!");
  });

  app.listen(port, () => console.log(`Server was started at port ${port}`));
};

module.exports = { expressApp };
