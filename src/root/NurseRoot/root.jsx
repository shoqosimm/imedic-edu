import React, { Suspense, useRef, useState } from "react";
import { Button, Drawer, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { CiViewList, CiCircleList } from "react-icons/ci";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineSetting,
} from "react-icons/ai";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import Swal from "sweetalert2";
import Loading from "../../components/Loader";
import { ContextItem } from "../../components/Context";
import { useContext } from "react";
import { FaUserMd } from "react-icons/fa";

const Nurse = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setToken] = useContext(ContextItem);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const headerRef = useRef();

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
        theme="dark"
        className="siderNurse"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <div
          className="logo"
          style={{
            textAlign: "center",
            padding: "1rem 0",
            borderBottom: "1px solid #ffffff63",
          }}
        >
          <FaUserMd style={{ fontSize: "28px", fill: "#fff" }} />
        </div>
        <Menu
          theme="dark"
          selectedKeys={sessionStorage.getItem("activeLink") ?? "1"}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon coursesIcon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 1)}
                  to="course"
                >
                  Kurslar
                </Link>
              ),
            },
            {
              key: "2",
              icon: <CiCircleList className="icon mycourseIcon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 2)}
                  to="mycourse"
                >
                  Mening kurslarim
                </Link>
              ),
            },
            {
              key: "3",
              icon: <AiOutlineSetting className="icon settingIcon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 3)}
                  to="setting"
                >
                  Sozlamalar
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header ref={headerRef}>
          <div
            style={{ height: "100%" }}
            className=" d-flex align-center justify-between"
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
        className="drawer"
        placement="left"
        title="Меню"
        onClose={() => setOpen(false)}
        open={open}
        width={200}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={localStorage.getItem("activeLink")}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon coursesIcon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 1)}
                  to="course"
                >
                  Kurslar
                </Link>
              ),
            },
            {
              key: "2",
              icon: <CiCircleList className="icon " />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="mycourse"
                >
                  Mening kurslarim
                </Link>
              ),
            },
            {
              key: "3",
              icon: <AiOutlineSetting className="icon " />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 3)}
                  to="setting"
                >
                  Sozlamalar
                </Link>
              ),
            },
          ]}
        />
      </Drawer>
    </Layout>
  );
};

export default Nurse;
