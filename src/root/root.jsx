import { Button, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { BiCamera, BiCar, BiUser } from "react-icons/bi";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import React, { useState } from "react";
import { Outlet,Link, useNavigate } from "react-router-dom";
import "./style.scss";

const Root = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  return (
    <Layout className="layout">
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{textAlign:'center',padding:'1rem 0',borderBottom:'1px solid lightgrey'}}>
          <h2>Dashboard</h2>
        </div>
        <Menu
        onClick={({key})=>{
            navigate(key)
            }
        }
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "main",
              icon: <BiUser />,
              label: "nav 1",
              path: 'main'
              
            },
            {
              key: "/nurse/course",
              icon: <BiCamera />,
              label: "nav 2",
              path: 'login'
            },
            {
              key: "3",
              icon: <BiCar />,
              label: "nav 3",
              path: 'register'
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: "0 1rem",
            background: "#fff",
            margin: "0 1rem",
            borderRadius: "2px",
          }}
        >
          <Button
            icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
            onClick={() => setCollapsed(!collapsed)}
          ></Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Root;
