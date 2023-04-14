import { Button, Drawer, Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { CiViewList, CiCircleList } from "react-icons/ci";
import { SlUser } from "react-icons/sl";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineSetting,
} from "react-icons/ai";
import React, { Suspense, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import Swal from "sweetalert2";
import Loading from "../../components/Loader";
import { ContextItem } from "../../components/Context";
import { useContext } from "react";

const Nurse = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setToken] = useContext(ContextItem);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // handleLogOut
  const handleLogOut = () => {
    Swal.fire({
      icon: "warning",
      title: "Вы действительно хотите выйти",
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
        theme="light"
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
            borderBottom: "1px solid lightgrey",
          }}
        >
          <SlUser style={{ fontSize: "28px" }} />
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={sessionStorage.getItem("activeLink")??'1'}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon coursesIcon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 1)}
                  to="course"
                >
                  Курсы
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
                  Мои курсы
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
                  Настройка
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
              Выйти
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
        title="Меню"
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
              icon: <CiViewList className="icon coursesIcon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 1)}
                  to="course"
                >
                  Курсы
                </Link>
              ),
            },
            {
              key: "2",
              icon: <CiCircleList className="icon mycourseIcon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="mycourse"
                >
                  Мои курсы
                </Link>
              ),
            },
            {
              key: "3",
              icon: <AiOutlineSetting className="icon settingIcon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 3)}
                  to="setting"
                >
                  Настройка
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
