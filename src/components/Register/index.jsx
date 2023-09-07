import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, DatePicker, Form, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment/moment";

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [options,setOptions] = useState([])
  const navigate = useNavigate();

  useEffect(()=>{
    api.get('api/branch/list')
    .then(res=>{
      if (res) {
        setOptions(
          res.data.map((item,index)=>{
            return{
              key:index,
              id:item.id,
              value:item.id,
              label:item.title
            }
          })
        )
      }
    })
  },[])

  // handleRegister
  const handleRegister = async (values) => {
    setloading(true);
    const body = {
      ...values,
      birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
    };
    const res = await api.post("api/user/register", body);
    try {
      if (res) {
        toast.success("Muvaffaqiyatli", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        setTimeout(() => {
          setloading(false);
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      console.log(err, "err");
      setloading(false);
      form.resetFields();
    } finally {
      setloading(false);
      form.resetFields();
    }
  };

  // getPnflInfo
  const getPnflInfo = async () => {
    setloading(true);
    const body = {
      pinfl: form.getFieldValue("pinfl"),
    };
    const res = await api.post("api/get-client-by-pinfl", body);
    try {
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Topildi",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        form.setFieldsValue({
          birth_date: moment(res.data.birth_date),
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          patronymic: res.data.patronymic,
          pinfl: res.data.pinfl,
        });
        setDisabled(true);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Ushbu PINFL bo'yicha ma'lumot topilmadi",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      console.log(err, "err");
      setloading(false);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="RegisterPage">
      <div className="container form_wrapper">
        <Form
          onFinish={handleRegister}
          autoComplete="off"
          layout="vertical"
          form={form}
          id="registerForm"
        >
          <div className="main_text">
            <h1>Ro'yxatdan o'tish</h1>
          </div>
          <div>
            <Form.Item
              name="pinfl"
              label="PINFL"
              rules={[
                {
                  required: true,
                  message: "PINFL to'g'ri kiriting (14ta)",
                  whitespace: true,
                  min: 14,
                  max: 14,
                },
              ]}
            >
              <Input
                maxLength={14}
                className="d-flex align-start"
                disabled={loading}
                placeholder="14ta son"
                suffix={<Button onClick={getPnflInfo}>Tekshirish</Button>}
              />
            </Form.Item>
            <div className="inputWrapper d-flex align-center gap-2">
              <Form.Item
                name="first_name"
                label="Ism"
                rules={[
                  {
                    required: true,
                    message: "Ism noto'g'ri kiritildi",
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled={disabled} />
              </Form.Item>
              <Form.Item
                name="last_name"
                label="Familiya"
                rules={[
                  {
                    required: true,
                    message: "Familiya noto'g'ri kiritildi",
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled={disabled} />
              </Form.Item>
            </div>
            <Form.Item name="patronymic" label="Otasining ismi">
              <Input disabled={disabled} />
            </Form.Item>
            <Form.Item name="phone" label="Telefon raqam">
              <Input
                disabled={loading}
                placeholder="998901234567"
                rules={[
                  {
                    required: true,
                    message: "Telefon raqam kiriting",
                    whitespace: true,
                    min: 12,
                  },
                ]}
              />
            </Form.Item>
            <Form.Item name="birth_date" label="Tug'ilgan sanasi">
              <DatePicker disabled />
            </Form.Item>
            <Form.Item  name="branch_id" label="Markaz filialini tanlang" >
                <Select 
                  size="large"
                  options={options}
                />
              </Form.Item>
            <div className="inputWrapper d-flex align-center gap-2">
           
              <Form.Item
                name="password"
                label="Parol"
                rules={[
                  {
                    required: true,
                    message: "Parol kiriting",
                    whitespace: true,
                    min: 6,
                  },
                ]}
              >
                <Input disabled={loading} type="password" />
              </Form.Item>
              <Form.Item
                name="password_confirmation"
                label="Parolni takrorlang"
                rules={[
                  {
                    required: true,
                    message: "Parol kiriting",
                    whitespace: true,
                    min: 6,
                  },
                ]}
              >
                <Input disabled={loading} type="password" />
              </Form.Item>
              
            </div>
          </div>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            Ro'yxatdan o'tish
          </Button>
          <div className="other__sign">
            <p>
              sizda akkaunt bormi unday bo'lsa, <Link to="/login">Kirish</Link>
            </p>
          </div>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
