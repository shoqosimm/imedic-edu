import React, { useState } from "react";
import "./style.scss";
import { Button, Form, Input } from "antd";
import { Link } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const [loading,setloading]=useState(false)


  // handleLogin
  const handleLogin =(values)=>{
    setloading(true)
    console.log(values,'login')
    setTimeout(()=>{
      setloading(false)
      form.resetFields()
    },2000)
  }

  return (
    <div className="loginPage">
      <div className="container form_wrapper">
        <Form onFinish={handleLogin} autoComplete='false' layout="vertical" form={form} id="loginForm">
          <div className="main_text">
            <h1>Войти</h1>
          </div>
          <div>
            <Form.Item name="phone" label="Номер телефона" rules={[{required:true,message:'Укажите номер телефона',whitespace:true}]}>
              <Input disabled={loading} placeholder="998901234567"/>
            </Form.Item>
            <Form.Item name="password" label="Пароль" rules={[{required:true,message:'Введите пароль',whitespace:true}]}>
              <Input disabled={loading}  type="password"/>
            </Form.Item>
          </div>
          <Button loading={loading} type="primary" htmlType="submit" style={{ width: "100%" }}>
            Войти
          </Button>
          <div className="other__sign">
            <p>
              или <Link to="/register">Регистрация</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
