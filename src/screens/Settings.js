import React, { useState } from "react";
import { Layout } from "../components/Layout";
import config from "electron-json-config";
import { shell } from "electron";
import {
  Divider,
  Toggle,
  Container,
  Input,
  Row,
  Col,
  Icon,
  InputGroup,
  InputPicker,
  Panel,
  Button,
  PanelGroup,
} from "rsuite";

import { RebootNotify } from "../components/RebootNotify";

const lockList = [
  {
    label: "Gnome",
    value: "gnome",
    command:
      "SESSION=$(loginctl list-sessions | grep $(whoami) | awk '{print $1}'); loginctl lock-session $SESSION",
  },
  {
    label: "KDE",
    value: "kde",
    command: "loginctl lock-session",
  },
  {
    label: "XFCE",
    value: "xfce",
    command: "xdg-screensaver lock",
  },
  {
    label: "Custom",
    value: "custom",
    command: "",
  },
];

const unlockList = [
  {
    label: "Gnome",
    value: "gnome",
    command:
      "SESSION=$(loginctl list-sessions | grep $(whoami) | awk '{print $1}'); loginctl unlock-session $SESSION",
  },
  {
    label: "KDE",
    value: "kde",
    command: "loginctl unlock-session",
  },
  {
    label: "XFCE",
    value: "xfce",
    command: "xdg-screensaver activate",
  },
  {
    label: "Custom",
    value: "custom",
    command: "",
  },
];

export default () => {
  const [active, setActive] = useState(false);
  const [lock, setLock] = useState("");
  const [unlock, setUnlock] = useState("");
  const [delay, setDelay] = useState(30);
  const [lockCommand, setLockCommand] = useState("");
  const [UnlockCommand, setUnLockCommand] = useState("");

  React.useEffect(() => {
    const default_value = "gnome";
    const delay_value = config.get("configs.delay");
    setActive(config.get("configs.enable"));
    setDelay(delay_value);
    setLock(
      config.has("configs.lock") ? config.get("configs.lock") : default_value
    );
    setUnlock(
      config.has("configs.unlock")
        ? config.get("configs.unlock")
        : default_value
    );
  }, []);

  const handleSave = () => {
    config.set("configs.delay", delay);
    config.set("configs.lock", lock);
    config.set("configs.unlock", unlock);
    config.set("configs.lock_command", lockCommand);
    config.set("configs.unlock_command", UnlockCommand);
  };

  const handleSwitch = (value) => {
    setActive(value);
    config.set("configs.enable", value);
    RebootNotify();
  };

  React.useEffect(() => {
    setLockCommand(
      lock
        ? lockList[lockList.findIndex((item) => item.value === lock)].command
        : ""
    );
  }, [lock]);

  React.useEffect(() => {
    setUnLockCommand(
      unlock
        ? unlockList[unlockList.findIndex((item) => item.value === unlock)]
            .command
        : ""
    );
  }, [unlock]);

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Icon
            icon="info"
            className="info-link"
            onClick={() =>
              shell.openExternal(
                "https://github.com/ssshojaei/locky/wiki/FingerPrint"
              )
            }
          />
          <span>Settings</span>
        </div>
        <Toggle
          size="md"
          checkedChildren="Enable App"
          unCheckedChildren="Disable App"
          checked={active}
          onChange={(value) => handleSwitch(value)}
        />
      </div>
      <Divider />
      <Container>
        <PanelGroup accordion bordered>
          <Panel header="Lock" defaultExpanded>
            <InputPicker
              style={{
                width: "100%",
                marginBottom: 10,
              }}
              data={lockList}
              value={lock}
              onChange={(value) => setLock(value)}
            />
            <Input
              placeholder="Shell Command..."
              value={lockCommand}
              onChange={(value) => setLockCommand(value)}
            />
          </Panel>
          <Panel header="Unlock">
            <InputPicker
              style={{
                width: "100%",
                marginBottom: 10,
              }}
              data={unlockList}
              value={unlock}
              onChange={(value) => setUnlock(value)}
            />
            <Input
              placeholder="Shell Command..."
              value={UnlockCommand}
              onChange={(value) => setUnLockCommand(value)}
            />
          </Panel>
          <Panel header="Delay Time">
            <Row style={{ marginTop: 10 }}>
              <Col xs={24}>
                <InputGroup>
                  <Input value={delay} onChange={(value) => setDelay(value)} />
                  <InputGroup.Addon>Second</InputGroup.Addon>
                </InputGroup>
              </Col>
            </Row>
          </Panel>
        </PanelGroup>

        <Button
          onClick={handleSave}
          appearance="primary"
          style={{
            marginTop: 10,
          }}
        >
          Save
        </Button>
      </Container>
    </Layout>
  );
};
