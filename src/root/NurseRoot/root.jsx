import React, { Suspense, useState } from "react";
import { Button, Layout, Menu, Popover, Select } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { CiMenuBurger } from "react-icons/ci";
import { AiOutlineLogout } from "react-icons/ai";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./style.scss";
import Swal from "sweetalert2";
import Loading from "../../components/Loader";
import { ContextItem } from "../../components/Context";
import { useContext } from "react";
import { BiGlobe } from "react-icons/bi";
import MedicLogo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

const Nurse = () => {
  const [token, setToken] = useContext(ContextItem);
  const {t,i18n} = useTranslation();
  
  const [lang,setLang] = useState(localStorage.getItem('lang') ||'uz');
  const navigate = useNavigate();

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

  const menus = [
    {
      key: "1",
      label: (
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => sessionStorage.setItem("activeLink", 1)}
          to="course"
        >
          Kurslar
        </NavLink>
      ),
    },
    {
      key: "2",
      label: (
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => sessionStorage.setItem("activeLink", 2)}
          to="mycourse"
        >
          Mening kurslarim
        </NavLink>
      ),
    },
    {
      key: "3",
      label: (
        <NavLink
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={() => sessionStorage.setItem("activeLink", 3)}
          to="setting"
        >
          Sozlamalar
        </NavLink>
      ),
    },
  ];
  const onSelectLang  = (val)=>{
    setLang(String(val))
    localStorage.setItem('lang',String(val))
    i18n.changeLanguage(val)
  }
  const menuItem = <Menu mode="vertical" items={menus} />;

  return (
    <div>
      <Layout className="layout">
        <div className="pre__header d-flex align-center gap-x-1">
          <BiGlobe style={{ fill: "#2572ff" }} />
          <p>www.edu.Imedic.uz</p>
        </div>
        <Header className="d-flex align-center justify-between">
          <Popover
            className="hamburger__menu"
            content={menuItem}
            placement="bottomRight"
            trigger={"click"}
          >
            <CiMenuBurger />
          </Popover>
          <div className="d-flex align-end  ">
            <img
              src={MedicLogo}
              alt="MedicLogo"
              width={60}
              height={60}
              className="logo"
            />
            <ul className="menu d-flex align-center gap-x-3">
              <li className="menu__item d-flex align-center gap-x-1">
                <NavLink
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => sessionStorage.setItem("activeLink", 1)}
                  to="course"
                >
                  {t('course')}
                </NavLink>
              </li>
              <li className="menu__item d-flex align-center gap-x-1">
                <NavLink
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => sessionStorage.setItem("activeLink", 2)}
                  to="mycourse"
                >
                  {t('myCourese')}
                </NavLink>
              </li>
              <li className="menu__item d-flex align-center gap-x-1">
                <NavLink
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => sessionStorage.setItem("activeLink", 3)}
                  to="setting"
                >
                  {t('setting')}
                </NavLink>
              </li>
            </ul>
          </div>
          <Select
            className="lang d-flex align-center gap-x-1"
            onSelect={onSelectLang}
            defaultValue={lang}
           
            options={[
              {label:'ru',value:'ru'},
              {label:'uz',value:'uz'}
            ]}
          />
          <Button
            className="logOut d-flex align-center gap-x-1"
            icon={<AiOutlineLogout />}
            type="primary"
            onClick={handleLogOut}
          >
            {t('logOut')}
          </Button>
        </Header>
        <marquee className='running__text' behavior="smooth" direction="left">Sayt test holatida ishlamoqda!</marquee>
        <Content className="layout_content">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Content>
      </Layout>
    </div>
  );
};

export default Nurse;
