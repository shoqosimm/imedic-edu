import { Button, Drawer, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { CiCircleList } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { GrUserAdmin } from "react-icons/gr";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import React, { useState, Suspense } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import Swal from "sweetalert2";
import Loading from "../../components/Loader";
import { useContext } from "react";
import { ContextItem } from "../../components/Context";

const AdminRoute = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setToken] = useContext(ContextItem);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // handleLogOut
  const handleLogOut = () => {
    Swal.fire({
      icon: "warning",
      title: "Siz haqiqatdan ham tark etmoqchimisiz",
    }).then((result) => {
      if (result.isConfirmed) {
        setToken(null);
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    });
  };

  return (
    <Layout className="layout">
      <Sider
        className="siderAdmin"
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div
          className="logo"
          style={{
            textAlign: "center",
            padding: "1rem 0",
            borderBottom: "1px solid lightgrey",
          }}
        >
          <GrUserAdmin style={{ fontSize: "34px" }} />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={sessionStorage.getItem("activeLink") ?? "1"}
          items={[
            {
              key: "1",
              icon: <FiUsers style={{ color: "blue" }} className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 1)}
                  to="admin-teacher"
                >
                  O'qituvchilar
                </Link>
              ),
            },
            {
              key: "2",
              icon: (
                <CiCircleList style={{ color: "brown" }} className="icon" />
              ),
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 2)}
                  to="category"
                >
                  Turkum
                </Link>
              ),
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
            borderRadius: "0 0 10px 10px",
          }}
        >
          <div
            style={{ height: "100%" }}
            className="d-flex align-center justify-between"
          >
            <Button
              className="menuBurger"
              icon={open ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setOpen(true)}
            ></Button>
            <Button
              className="sizeChanger"
              icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
              onClick={() => setCollapsed(!collapsed)}
            ></Button>
            <Button
              className="logOut d-flex align-center gap-x-1"
              icon={<AiOutlineLogout />}
              onClick={handleLogOut}
            >
              Chiqish
            </Button>
          </div>
        </Header>
        <Content className="layout_content">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
      <Drawer
        placement="left"
        title="Menu"
        onClose={() => setOpen(false)}
        open={open}
        width={200}
      >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={localStorage.getItem("activeLink")}
          items={[
            {
              key: "1",
              icon: <FiUsers style={{ color: "blue" }} className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 1)}
                  to="admin-teacher"
                >
                  O'qituvchilar
                </Link>
              ),
            },
            {
              key: "2",
              icon: (
                <CiCircleList style={{ color: "brown" }} className="icon" />
              ),
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="category"
                >
                  Turkum
                </Link>
              ),
            },
          ]}
        />
      </Drawer>
    </Layout>
  );
};

export default AdminRoute;
