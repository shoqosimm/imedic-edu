import React, { Suspense } from "react";
import { Button, Layout, Menu, Popover } from "antd";
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

const Nurse = () => {
  const [, setToken] = useContext(ContextItem);
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
  const menuItem = <Menu mode="vertical" items={menus} />;

  return (
    <div>
      <Layout className="layout">
        <div className="pre__header d-flex align-center gap-x-1">
          <BiGlobe  style={{fill:'#2572ff'}}/>
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
          <ul className="menu d-flex align-center gap-x-3">
            <li className="menu__item d-flex align-center gap-x-1">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => sessionStorage.setItem("activeLink", 1)}
                to="course"
              >
                Kurslar
              </NavLink>
            </li>
            <li className="menu__item d-flex align-center gap-x-1">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => sessionStorage.setItem("activeLink", 2)}
                to="mycourse"
              >
                Mening kurslarim
              </NavLink>
            </li>
            <li className="menu__item d-flex align-center gap-x-1">
              <NavLink
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => sessionStorage.setItem("activeLink", 3)}
                to="setting"
              >
                Sozlamalar
              </NavLink>
            </li>
          </ul>
          <Button
            className="logOut d-flex align-center gap-x-1"
            icon={<AiOutlineLogout />}
            onClick={handleLogOut}
          >
            Chiqish
          </Button>
        </Header>
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
