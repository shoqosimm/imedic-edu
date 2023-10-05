import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, Table, Modal, Form, Row, Col, Input, DatePicker, Select } from "antd";
import { api } from "../../../utils/api";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { t } from "i18next";
const UserList = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [branch,setBranch]=useState([])
  const [searchText,setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
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
      title:t('pasport'),
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
      title: t("status"),
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
      title:t('blok'),
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
  ];
  //getUserList
  const  getUserList= async (page, pageSize) => {
    setTableLoading(true);
    const body = {
      page,
      pageSize,
      search:searchText
    };
    const res = await api.get("api/admin/admin/list",{params:body});  
    try {
      if (res) {
        setData(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              passport: { series: item.series, number: item.number },
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
  
  // addUser
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const addUser = async (values) => {
    const body = {
      ...values,
      birth_date: moment(values.birth_date).format("YYYY-MM-DD"),
    };
    const res = await api.post("api/admin/admin/add", body);
    try {
      if (res) {
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
  //getBranch
  useEffect(() => {
        api.get('api/branch/list').then((res)=>{
            if (res.status==200) {
                setBranch(
                    res.data.map((item)=>{
                       return{
                        value:item?.id,
                        label:item?.title,
                       }
                    })
                )}
        }).catch((error)=>{
            console.log(error);
        })
    getUserList(1, 15);
  }, []);
  useEffect(()=>{
    getUserList()
  },[searchText])

//serch
const textSearch = (e) => {
    const   value = e.target.value
    if (value.length > 3) {
        setSearchText(e.target.value)
    }
}
  return (
    <div className="admin_teacher">
         <div style={{display:'flex', justifyContent:'flex-end'}}>
        <Button  onClick={handleAdd} className="teacher_btn " type="primary">
          {t('addition')}
      </Button>
        </div>
      <Input placeholder={t('search')} onChange={textSearch}/>
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
            getUserList(current_page, per_page);
          },
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />
      <Modal
        width={720}
        title={t('userAdd')}
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
              form="addUser"
              style={{ borderRadius: "2px", height: "40px" }}
              type="primary"
              loading={loading}
            >
             {t('addition')}
            </Button>
          </div>
        }
      >
        <Form
          onFinish={addUser}
          form={form}
          layout="vertical"
          id="addUser"
        >
          <Row gutter={[20]}>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="first_name" label={t('name')}>
                <Input disabled  />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="last_name" label={t('surName')}>
                <Input disabled   />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="patronymic" label={t('midName')}>
                <Input disabled  />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="series"
                label={t('passportSeries')}
                rules={[
                  {
                    required: true,
                    min: 2,
                    max: 2,
                    message: t('typingPassportSeries'),
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
                label={t('passportNumber')}
                rules={[
                  {
                    required: true,
                    min: 7,
                    max: 7,
                    message: t('typingPassportNumber'),
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
            label={t('pinfl')}
            rules={[
              {
                required: true,
                min: 14,
                max: 14,
                message:t('typingPassportNumber'),
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
                max:12,
                mask:`/^(998)([0-9]{9})$/`,
                message: t('typingPhoneNumber'),
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="998901234567" disabled={loading} />
          </Form.Item>
          <Form.Item 
          name={"birth_date"} 
          label={t('birth')}
            >
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name={'branch_id'}
            label={t('branchName')}
          >
            <Select
                options={branch}
             />
          </Form.Item>
          <Row gutter={[20]}>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password"
                label={t('password')}
                required={[{ required: true, min: 6 }]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
            <Col xl={12} lg={12} md={24} sm={24} xs={24}>
              <Form.Item
                name="password_confirmation"
                label={t('confirmation')}
                required={[{ required: true, min: 6 }]}
              >
                <Input disabled={loading} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
};
export default UserList;
