import React from "react";
import { Nav, Icon, Sidenav, Container, Content, Grid } from "rsuite";
import "../assets/css/App.css";
import { useHistory, useLocation } from "react-router-dom";

export const Layout = ({ children }) => {
  const pathname = useLocation().pathname;
  const history = useHistory();
  const [active, setActive] = React.useState(pathname);
  return (
    <div
      className="show-fake-browser navbar-page"
      style={{
        minHeight: "100vh",
      }}
    >
      <Container>
        <Content>
          <Grid fluid style={{ padding: 0 }}>
            <div
              style={{
                display: "flex",
              }}
            >
              <Sidenav
                style={{ height: "100vh" }}
                activeKey={active}
                expanded={false}
                onSelect={(key) => {
                  setActive(key);
                  history.push(key);
                }}
              >
                <Sidenav.Body>
                  <Nav>
                    <Nav.Item eventKey="/" icon={<Icon icon="wifi" />}>
                      FingerPrint
                    </Nav.Item>
                    <Nav.Item
                      eventKey="/bluetooth"
                      icon={
                        <Icon
                          icon="bluetooth-b"
                          style={{ marginLeft: "0.2em" }}
                        />
                      }
                    >
                      Bluetooth
                    </Nav.Item>
                    <Nav.Item
                      eventKey="/wired"
                      icon={
                        <Icon icon="plug" style={{ marginLeft: "0.1em" }} />
                      }
                    >
                      Wired
                    </Nav.Item>

                    <Nav.Item
                      eventKey="/settings"
                      icon={<Icon icon="cog" style={{ marginLeft: "0.2em" }} />}
                    >
                      Settings
                    </Nav.Item>
                  </Nav>
                </Sidenav.Body>
              </Sidenav>
              <div
                style={{
                  padding: "2em 3em",
                  width: "100%",
                }}
              >
                {children}
              </div>
            </div>
          </Grid>
        </Content>
      </Container>
    </div>
  );
};
