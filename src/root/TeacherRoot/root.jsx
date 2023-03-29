import { Button, Layout, Menu, Drawer } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { CiViewList } from "react-icons/ci";
import { TbReport } from "react-icons/tb";
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineSetting,
} from "react-icons/ai";
import React, { useState, Suspense } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import Swal from "sweetalert2";
import Loading from "../../components/Loader";

const Teacher = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // handleLogOut
  const handleLogOut = () => {
    Swal.fire({
      icon: "warning",
      title: "Вы действительно хотите выйти",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("activeLink");
        localStorage.removeItem("role");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    });
  };

  return (
    <Layout className="layout">
      <Sider
        className="siderTeacher"
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
          <h2>Учитель</h2>
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={localStorage.getItem("activeLink")}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon" />,
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
              icon: <AiOutlineSetting className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="setting"
                >
                  Настройка
                </Link>
              ),
            },
            {
              key: "3",
              icon: <TbReport className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 3)}
                  to="report"
                >
                  Отчет
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
            borderRadius: "2px",
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
              onClick={handleLogOut}
              className="d-flex align-center gap-x-1"
              icon={<AiOutlineLogout />}
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
          defaultSelectedKeys={localStorage.getItem("activeLink")}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon" />,
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
              icon: <AiOutlineSetting className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="setting"
                >
                  Настройка
                </Link>
              ),
            },
            {
              key: "3",
              icon: <TbReport className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 3)}
                  to="report"
                >
                  Отчет
                </Link>
              ),
            },
          ]}
        />
      </Drawer>
    </Layout>
  );
};

export default Teacher;
