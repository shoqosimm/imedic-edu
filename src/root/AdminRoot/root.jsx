import { Button, Drawer, Layout, Menu,Select } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { CiCircleList } from "react-icons/ci";
import { FiUsers} from "react-icons/fi";
import {FaUserNurse} from 'react-icons/fa'
import {MdCalendarMonth} from 'react-icons/md'
import {
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold
} from "react-icons/ai";
import {FaUserGraduate} from 'react-icons/fa'
import React, { useState, Suspense } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import Swal from "sweetalert2";
import Loading from "../../components/Loader";
import { useContext } from "react";
import { ContextItem } from "../../components/Context";
import { FaUserShield } from "react-icons/fa";
import {CgListTree} from "react-icons/cg";
import{FcStatistics} from "react-icons/fc"
import { useTranslation } from "react-i18next";
import { t } from "i18next";
 const AdminRoute = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [, setToken] = useContext(ContextItem);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const {t,i18n} = useTranslation();
  const [lang,setLang] = useState(localStorage.getItem('lang') ||'uz');
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
  //lang
  const onSelectLang  = (val)=>{
    setLang(String(val))
    localStorage.setItem('lang',String(val))
    i18n.changeLanguage(val)
  }
  return (
    <Layout className="layout">
      <Sider
        className="siderAdmin"
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
          <FaUserShield style={{ fontSize: "34px", fill: "#fff" }} />
        </div>
        <Menu
          theme="dark"
          selectedKeys={sessionStorage.getItem("activeLink") ?? "1"}
          items={[
            {
              key: "1",
              icon: <FaUserGraduate className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 1)}
                  to="admin-teacher"
                >
                {t('teacher')}
                </Link>
              ),
            },
            {
              key: "2",
              icon: <CiCircleList className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 2)}
                  to="category"
                >
                 {t('direction')}
                </Link>
              ),
            },
            {
              key: "3",
              icon: <CgListTree className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 3)}
                  to="branch"
                >
                   {t('branch')}
                </Link>
              ),
            },
            {
              key: "4",
              icon: <FaUserNurse className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 4)}
                  to="nurses"
                >
                 {t('nurse')}
                </Link>
              ),
            },            {
              key: "5",
              icon: <FiUsers className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 5)}
                  to="users"
                >
                  {t('users')}
                </Link>
              ),
            }, {
              key: "6",
              icon: <MdCalendarMonth className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 6)}
                  to="months"
                >
                   {t('months')}
                </Link>
              ),
            },
            {
              key: "7",
              icon: <FcStatistics className="icon" />,
              label: (
                <Link
                  onClick={() => sessionStorage.setItem("activeLink", 7)}
                  to="statistic"
                >
                  {t('statistics')}
                </Link>
              ),
            }
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
            <div className="d-flex justify-center align-center">
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
              className="logOut d-flex align-center gap-x-1"
              icon={ <AiOutlineLogout /> }
              onClick={handleLogOut}
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
          selectedKeys={localStorage.getItem("activeLink") }
          items={[
            {
              key: "1",
              icon: <FiUsers className="icon" />,
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
              icon: <CiCircleList className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 2)}
                  to="category"
                >
                  Yo`nalishlar
                </Link>
              ),
            },
            {
              key: "3",
              icon: <CgListTree className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 3)}
                  to="branch"
                >
                  Filiallar
                </Link>
              ),
            },
            {
              key: "4",
              icon: <CgListTree className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 4)}
                  to="nurses"
                >
                  Hamshiralar
                </Link>
              ),
            },
            {
              key: "5",
              icon: <CgListTree className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 5)}
                  to="users"
                >
                  Foydalanuvchilar
                </Link>
              ),
            },
            {
              key: "6",
              icon: <MdCalendarMonth className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 5)}
                  to="months"
                >
                  Oylar
                </Link>
              ),
            },
            {
              key: "7",
              icon: <FcStatistics className="icon" />,
              label: (
                <Link
                  onClick={() => localStorage.setItem("activeLink", 5)}
                  to="statistic"
                >
                  Statistika
                </Link>
              ),
            }
          ]}
        />
      </Drawer>
    </Layout>
  );
};

export default AdminRoute;
