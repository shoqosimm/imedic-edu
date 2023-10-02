import React, { useState } from "react";
import "./style.scss";
import { Button, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { ContextItem } from "../Context";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

const Login = () => {
const {i18n} = useTranslation();
  const [lang,setLang] = useState(localStorage.getItem('lang')||'uz')
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [, setToken] = useContext(ContextItem);
  const navigate = useNavigate();

  // handleLogin
  const handleLogin = async (values) => {
    setloading(true);
    const body = values;
    const res = await api.post("api/login", body);
    try {
      if (res) {
        toast.success(t('successful'), {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setToken(res.data.access_token);
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
  const onSelectLang=(val)=>{
    setLang(val)
    localStorage.setItem('lang',val);
    i18n.changeLanguage(val);
  }
  return (
    <div className="loginPage">
      <div className="container form_wrapper">
        <Select
        defaultValue={lang}
        onSelect={onSelectLang}
          options={[
            {label:'ru',value:'ru'},
            {label:'uz',value:'uz'}
          ]}
        />
        <Form
          onFinish={handleLogin}
          autoComplete="off"
          layout="vertical"
          form={form}
          id="loginForm"
        >
          <div className="main_text">
            <h1>{t('login')}</h1>
          </div>
          <div>
            <Form.Item
              name="phone"
              label={t('phoneNumber')}
              rules={[
                {
                  required: true,
                  message: t('typingPhoneNumber'),
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
              label={t('password')}
              rules={[
                { required: true, message:t('newPassword'), whitespace: true },
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
            {t('login')}
          </Button>
          <div className="other__sign">
            <p>
              {t('else')} <Link to="/register">{t('orRegister')}</Link>
            </p>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
