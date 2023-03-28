import React, { useState } from "react";
import "./style.scss";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  // handleLogin
  const handleLogin = async (values) => {
    setloading(true);
    const body = values;
    const res = await api.post("api/login", body);
    try {
      if (res) {
        toast.success("Успешно", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("role", res.data.role);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      console.log(err, "err");
      setloading(false);
      form.resetFields();
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="container form_wrapper">
        <Form
          onFinish={handleLogin}
          autoComplete="false"
          layout="vertical"
          form={form}
          id="loginForm"
        >
          <div className="main_text">
            <h1>Войти</h1>
          </div>
          <div>
            <Form.Item
              name="phone"
              label="Номер телефона"
              rules={[
                {
                  required: true,
                  message: "Укажите номер телефона",
                  whitespace: true,
                },
              ]}
            >
              <Input
                autoComplete="false"
                disabled={loading}
                placeholder="998901234567"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Пароль"
              rules={[
                { required: true, message: "Введите пароль", whitespace: true },
              ]}
            >
              <Input autoComplete="false" disabled={loading} type="password" />
            </Form.Item>
          </div>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
          >
            Войти
          </Button>
          <div className="other__sign">
            <p>
              или <Link to="/register">Регистрация</Link>
            </p>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
