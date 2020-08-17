import React from "react";
import { remote } from "electron";
import { Button, ButtonToolbar, Notification } from "rsuite";

export const RebootNotify = () =>
  Notification.warning({
    title: "Restart",
    placement: "bottomEnd",
    duration: 0,
    description: (
      <div>
        <p>Restart the program to apply the changes</p>
        <ButtonToolbar>
          <Button
            onClick={() => {
              remote.app.relaunch();
              remote.app.exit(0);
            }}
          >
            Now
          </Button>
          <Button
            onClick={() => {
              Notification.close();
            }}
          >
            Later
          </Button>
        </ButtonToolbar>
      </div>
    ),
  });
