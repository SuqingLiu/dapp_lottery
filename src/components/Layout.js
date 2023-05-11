import React from "react";
import {
  ShopOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { useRouter } from "next/router";

const { Header, Content, Footer, Sider } = Layout;

const AntLayout = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const router = useRouter();

  const onMenuClick = (event) => {
    const { key } = event;

    // Navigate to the corresponding route
    if (key === "1") {
      router.push("/");
    } else if (key === "2") {
      router.push("/purchase");
    } else if (key === "3") {
      router.push("/profile");
    }
  };

  const menuItems = [
    { key: "1", label: "Home", icon: <HomeOutlined /> },
    { key: "2", label: "Purchase", icon: <ShopOutlined /> },
    { key: "3", label: "Profile", icon: <UserOutlined />}
  ];

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={
            router.pathname === "/profile" ? ["3"] : router.pathname === "/purchase" ? ["2"] : ["1"]
          }
          onClick={onMenuClick}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
          }}
        >
          <h2 style={{ color: "#000000", marginLeft: "16px" }}>
            MOK LOTTERY
          </h2>
        </Header>
        <Content style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          @2022 Created by SL
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AntLayout;
