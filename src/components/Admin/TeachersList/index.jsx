import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, Table, Modal, Form, Row, Col, Input, DatePicker } from "antd";
import { api } from "../../../utils/api";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { t } from "i18next";
import {GrUpdate} from 'react-icons/gr'
const AdminTeacherList = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen,setModalOpen]=useState(false)
  const [editId,setEditId] = useState(null)
  const [searchText,setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });
  const columns = [
    {
      title: "№",
      dataIndex: "id",
      key: "id",
    },
    {
      title: t('name'),
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: t('surName'),
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: t('midName'),
      dataIndex: "patronymic",
      key: "patronymic",
    },
    {
      title: t('birth'),
      dataIndex: "birth_date",
      key: "birth_date",
    },
    {
      title: t('phoneNumber'),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Pasport",
      dataIndex: "passport",
      key: "passport",
      render: (text) => {
        return (
          <p>
            {text.series}-{text.number}
          </p>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      align: "center",
      render: (text) => {
        return (
          (text === "1" && (
            <BiCheckCircle style={{ fill: "green", fontSize: "18px" }} />
          )) ||
          (text === "0" && (
            <AiOutlineCloseCircle style={{ fill: "red", fontSize: "18px" }} />
          ))
        );
      },
    },
    {
      title: "Blok",
      dataIndex: "is_block",
      key: "is_block",
      align: "center",
      render: (text) => {
        return (
          (text === "1" && (
            <BiCheckCircle style={{ fill: "green", fontSize: "18px" }} />
          )) ||
          (text === "0" && (
            <AiOutlineCloseCircle style={{ fill: "red", fontSize: "18px" }} />
          ))
        );
      },
    },
    {
      title: 'Amallar',
      dataIndex: 'action',
      key: 'action',
  },
  ];
//numberUp
const handelPass=(id)=>{
  setEditId(id)
setModalOpen(true)
}
const saveNumber=()=>{
  const values = form.getFieldsValue()
  if (values.phone==values.phone_confirmation) {
    const body = {
        id:editId,
        phone: values.phone,
    }
    api.post('api/admin/teacher/update/user/phone',body)
    .then(res=>{
        if (res) {
            setIsModalOpen(false);
            form.resetFields();
        }
    })       
} 
}
  // getTeacherList
  const getTeacherList = async (page, pageSize) => {
    setTableLoading(true);
    const body = {
      page,
      pageSize,
      search:searchText
    };
    const res = await api.get("api/admin/teacher/list", { params: body });
    console.log(res)
    try {
      if (res) {
        setData(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              passport: { series: item.series, number: item.number },
              action:<div 
              style={{display:'flex', justifyContent:'center',alignItems:'center'}}><Button  onClick={()=>handelPass(item.id)}><GrUpdate/></Button></div>
            };
          })
        );
        setPagination({
          page: res.data.current_page,
          pageSize: res.data.per_page,
          total: res.data.total,
        });
        setTableLoading(false);
      }
    } catch (err) {
      console.log(err, "err");
      setTableLoading(false);
    } finally {
      setTableLoading(false);
    }
  };
  // handlePnfl
  const handlePnfl = async () => {
    setLoading(true);
    const body = { pinfl: form.getFieldValue("pinfl") };
    const res = await api.post("api/get-client-by-pinfl", body);
    try {
      if (res) {
        setLoading(false);
        form.setFieldsValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          patronymic: res.data.patronymic,
          series: res.data.series,
          number: res.data.number,
          birth_date: moment(res.data.birth_date),
        });
      }
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // addTeacher
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const addTeacher = async (values) => {
    setLoading(true);
    const body = {
      ...values,
      birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
    };
    const res = await api.post("api/admin/teacher/add", body);
    console.log(res)
    try {
      if (res) {
        setLoading(false);
        toast.success("Yaratildi!");
      }
      toast.error("Ma'lumotlar noto'g'ri ko'rsatildi");
    } catch (err) {
      console.log(err, "err");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getTeacherList(1, 15);
  }, []);
  //search
  useEffect(()=>{
    getTeacherList()
  },[searchText])
  
  const textSearch = (e) => {
    const   value = e.target.value
   
    if (value.length > 1) {
        setSearchText(e.target.value)
    }
}
  
  return (
    <div className="admin_teacher">
        <div style={{display:'flex', justifyContent:'flex-end'}}>
        <Button  onClick={handleAdd} className="teacher_btn " type="primary">
        Qo'shish
      </Button>
        </div>
        <Input placeholder="Qidirish..." onChange={textSearch}/>
      <Table
        loading={tableLoading}
        scroll={{ x: 400 }}
        columns={columns}
        dataSource={data}
        pagination={{
          current_page: pagination.current,
          per_page: pagination.pageSize,
          total: pagination.total,
          onChange: (current_page, per_page) => {
            getTeacherList(current_page, per_page);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <Modal
        width={720}
        title="O'qituvchi qo'shish"
        open={isModalOpen}
        onCancel={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
        footer={
          <div>
            <Button
              disabled={loading}
              onClick={() => {
                form.resetFields();
                setIsModalOpen(false);
              }}
              style={{ borderRadius: "2px", height: "40px" }}
            >
              {t('notSave')}
            </Button>
            <Button
              htmlType="submit"
              form="addTeacher"
              style={{ borderRadius: "2px", height: "40px" }}
              type="primary"
              loading={loading}
            >
              Qo'shish
            </Button>
          </div>
        }
      >
        <Form
          onFinish={addTeacher}
          form={form}
          layout="vertical"
          id="addTeacher"
        >
          <Row gutter={[20]}>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="first_name" label="Ismi">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="last_name" label="Familiyasi">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="patronymic" label="Otasining ismi">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="series"
                label="Pasport seriyasi"
                rules={[
                  {
                    required: true,
                    min: 2,
                    max: 2,
                    message: "Pasport seriyasini kiriting",
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="number"
                label="Pasport raqami"
                rules={[
                  {
                    required: true,
                    min: 7,
                    max: 7,
                    message: "Pasport raqamini kiriting",
                    whitespace: true,
                  },
                ]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="pinfl"
            label="PINFL"
            rules={[
              {
                required: true,
                min: 14,
                max: 14,
                message: "Pinfl ni kiriting",
                whitespace: true,
              },
            ]}
          >
            <Input suffix={<Button onClick={handlePnfl}>{t('check')}</Button>} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t('phoneNumber')}
            rules={[
              {
                required: true,
                min: 12,
                message: t('typingPhoneNumber'),
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="998901234567" disabled={loading} />
          </Form.Item>
          <Form.Item name={"birth_date"} label={t('birth')}>
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label="Parol"
                required={[{ required: true, min: 6 }]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password_confirmation"
                label="Parolni takrorlang"
                required={[{ required: true, min: 6 }]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      {modalOpen && 
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={
                    <div>
                        <Button className="btn btn-danger" onClick={() => setModalOpen(false)}>{t('notSave')}</Button>
                        <Button className="btn btn-success" onClick={saveNumber} >{t('save')}</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    initialValues={{ remember: true }}
                >
                     <Form.Item name={'phone'} label="telefon raqim"  >
                        <Input onClick={()=>setCurrent(current +1)} /> 
                    </Form.Item>
                    <Form.Item name={'phone_confirmation'} label="Telefon raqmni kiriting"  >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            }
      <ToastContainer />
    </div>
  );
};
export default AdminTeacherList;
