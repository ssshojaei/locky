import React from "react";
import { Layout } from "../components/Layout";
import { RebootNotify } from "../components/RebootNotify";
import config from "electron-json-config";
import {
  Divider,
  Toggle,
  Container,
  Row,
  Col,
  Notification,
  Icon,
  List,
  Button,
} from "rsuite";
import { getDevices, isConnected } from "../libs/adb";
import { shell } from "electron";

export default () => {
  const [active, setActive] = React.useState(true);
  const [list, setList] = React.useState([]);
  const [activeItem, setActiveItem] = React.useState("");

  React.useEffect(() => {
    setList(getDevices());
    setActive(config.get("wire.enable"));
    setActiveItem(config.get("wire.uuid"));
  }, []);

  const handleSwitch = (value) => {
    const uuid = config.get("wire.uuid");
    // check device connected
    if (value === false || isConnected(uuid)) {
      setActive(value);
      config.set("wire.enable", value);
      RebootNotify();
    } else {
      Notification.error({
        title: "Error",
        description: "Device must be connected. Please try again",
        placement: "bottomEnd",
      });
    }
  };

  const handleClick = (uuid) => {
    config.set("wire.uuid", uuid);
    setActiveItem(uuid);
  };

  const handleRefresh = () => setList(getDevices());

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
              shell.openExternal("https://github.com/ssshojaei/locky/wiki/wire")
            }
          />
          <span>wire</span>
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
          <Col xs={24}>
            <List bordered>
              {list.length ? (
                list.map((item, index) => (
                  <List.Item
                    key={index}
                    index={index}
                    onClick={() => handleClick(item.uuid)}
                    style={{
                      background:
                        activeItem === item.uuid ? "#169de0" : "transparent",
                    }}
                  >
                    {item.title}
                  </List.Item>
                ))
              ) : (
                <List.Item>No devices found</List.Item>
              )}
            </List>
          </Col>
        </Row>
        <Row>
          <Col xs={24} style={{ marginTop: "1em" }}>
            <Button appearance="primary" onClick={handleRefresh}>
              Refresh
            </Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};
