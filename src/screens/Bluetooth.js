import React from "react";
import { Layout } from "../components/Layout";
import config from "electron-json-config";
import {
  getDevices,
  disconnect,
  connect,
  isConnected,
} from "../libs/bluetooth";
import {
  Divider,
  Toggle,
  Container,
  Row,
  Col,
  Icon,
  List,
  Loader,
  FlexboxGrid,
  Button,
  Notification,
} from "rsuite";
import { RebootNotify } from "../components/RebootNotify";

export default () => {
  const [active, setActive] = React.useState(false);
  const [list, setList] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    setList(getDevices());
    setActive(config.get("bluetooth.enable"));
  }, []);

  const handleClick = (mac, connected) => {
    if (!connected) {
      setLoad(true);
      connect(mac).then((res) => {
        setLoad(false);
        handleRefresh();
        if (isConnected(mac)) {
          config.set("bluetooth.mac", mac);
        }
      });
    } else {
      setLoad(true);
      disconnect(mac).then((res) => {
        setLoad(false);
        handleRefresh();
      });
    }
  };

  const handleRefresh = () => setList(getDevices());

  const handleSwitch = (value) => {
    // check device connected
    const mac = config.get("bluetooth.mac");
    if (value === false || isConnected(mac)) {
      setActive(value);
      config.set("bluetooth.enable", value);
      RebootNotify();
    } else {
      Notification.error({
        title: "Error",
        description: "Device must be connected. Please try again",
        placement: "bottomEnd",
      });
    }
  };

  return load ? (
    <Loader backdrop content="loading..." vertical />
  ) : (
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
                "https://github.com/ssshojaei/locky/wiki/Bluetooth"
              )
            }
          />
          <span>Bluetooth</span>
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
        {
          // load ? <Loader backdrop content="loading..." vertical /> : null
        }
        <Row>
          <Col xs={24}>
            <div>
              <List bordered>
                {list.map((item, index) => (
                  <List.Item
                    key={index}
                    index={index}
                    style={{
                      background: isConnected(item.macAddress)
                        ? "#169de0"
                        : "transparent",
                    }}
                    onClick={() =>
                      handleClick(item.macAddress, isConnected(item.macAddress))
                    }
                  >
                    <FlexboxGrid>
                      <FlexboxGrid.Item colspan={23}>
                        {item.name}
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={1}>
                        {
                          <Icon
                            icon={
                              isConnected(item.macAddress) ? "link" : "unlink"
                            }
                          />
                        }
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                ))}
              </List>
            </div>
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
