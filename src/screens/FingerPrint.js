import React from "react";
import { Layout } from "../components/Layout";
import config from "electron-json-config";
import { shell } from "electron";
import {
  Divider,
  Toggle,
  Container,
  Input,
  InputNumber,
  Row,
  Col,
  Button,
  Icon,
} from "rsuite";
import ipAddress from "../libs/ipAddress";
import { RebootNotify } from "../components/RebootNotify";

export default () => {
  const [active, setActive] = React.useState(true);
  const [ip, setIp] = React.useState("xxx.xxx.x.xx");
  const [port, setPort] = React.useState(7130);

  React.useEffect(() => {
    setActive(config.get("finger.enable"));
    setPort(config.get("finger.port"));
    setIp(ipAddress());
  }, []);

  const handleClick = () => {
    config.set("finger.port", port);
    RebootNotify();
  };

  const handleSwitch = (value) => {
    setActive(value);
    config.set("finger.enable", value);
    RebootNotify();
  };

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
          <span>FingerPrint</span>
        </div>
        <Toggle
          size="md"
          checkedChildren="Active"
          unCheckedChildren="Disable"
          checked={active}
          onChange={(value) => handleSwitch(value)}
        />
      </div>
      <Divider />
      <Container>
        <Row>
          <Col xs={16}>
            <Input value={ip} disabled />
          </Col>
          <Col xs={8}>
            <InputNumber
              value={port}
              onChange={(value) => setPort(value)}
              type="number"
              placeholder="port"
              min={1000}
              max={9999}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            style={{
              marginTop: "1em",
            }}
          >
            <Button onClick={handleClick} appearance="primary">
              Save
            </Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
