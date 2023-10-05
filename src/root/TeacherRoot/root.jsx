import { Button, Layout, Menu, Drawer,Select } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { CiViewList } from "react-icons/ci";
import { TbReport } from "react-icons/tb";
import { FaUserNurse } from "react-icons/fa";
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
import { ContextItem } from "../../components/Context";
import { useContext } from "react";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
const Teacher = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setToken] = useContext(ContextItem);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const {t,i18n} = useTranslation();
  const [lang,setLang] = useState(localStorage.getItem('lang') ||'uz');

  //lang
  const onSelectLang  = (val)=>{
    setLang(String(val))
    localStorage.setItem('lang',String(val))
    i18n.changeLanguage(val)
  }
  // handleLogOut
  const handleLogOut = () => {
    Swal.fire({
      icon: "warning",
      title:t('exit'),
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
        className="siderTeacher"
        theme="dark"
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
          <FaUserNurse style={{ fontSize: "34px", fill: "white" }} />
        </div>
        <Menu
          theme="dark"
          selectedKeys={sessionStorage.getItem("activeLink") ?? "1"}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 1)}
                  to="course"
                >
                  {t('course')}
                </Link>
              ),
            },
            {
              key: "2",
              icon: <TbReport className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 2)}
                  to="report"
                >
                  {t('report')}
                </Link>
              ),
            },
            {
              key: "3",
              icon: <AiOutlineSetting className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 3)}
                  to="setting"
                >
                  {t('setting')}
                </Link>
              ),
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header>
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
            <div className=" d-flex justify-center align-center">
            <Select
            className="lang d-flex gap-x-1"
            onSelect={onSelectLang}
            defaultValue={lang}
            style={{width:60,justifyContent:"end"}}
            options={[
              {label:'ru',value:'ru'},
              {label:'uz',value:'uz'}
            ]}
          />
            <Button
              onClick={handleLogOut}
              className="logOut d-flex align-center gap-x-1"
              icon={<AiOutlineLogout />}
            >
              {t('logOut')}
            </Button>
            </div>
            
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
          theme="dark"
          mode="inline"
          selectedKeys={localStorage.getItem("activeLink")}
          items={[
            {
              key: "1",
              icon: <CiViewList className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 1)}
                  to="course"
                >
                   {t('course')}
                </Link>
              ),
            },
            {
              key: "2",
              icon: <TbReport className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="report"
                >
                 {t('report')}
                </Link>
              ),
            },
            {
              key: "3",
              icon: <AiOutlineSetting className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 3)}
                  to="setting"
                >
                  {t('setting')}
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
