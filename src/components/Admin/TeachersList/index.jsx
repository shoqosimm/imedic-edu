import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button, Table, Modal, Form, Row, Col, Input, DatePicker ,Steps,Select, notification} from "antd";
import { api } from "../../../utils/api";
import { BiCheckCircle } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { t } from "i18next";
import {GrUpdate} from 'react-icons/gr'
import {FiEdit} from 'react-icons/fi'
import {MdPassword} from 'react-icons/md'
const AdminTeacherList = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [modalOpen,setModalOpen]=useState(false)
  const [editId,setEditId] = useState(null)
  const [phoneId,setPhoneId]=useState(null)
  const [searchText,setSearchText] = useState('')
  const [onstep,setOnStep]=useState(false)
  const[current,setCurrent]=useState(0)
  const [branch,setBranch]=useState([])
  const [editModal,setEditModal]=useState(false)
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
      align:'center'
    },
    {
      title: t('name'),
      dataIndex: "first_name",
      key: "first_name",
      align:'center'
    },
    {
      title: t('surName'),
      dataIndex: "last_name",
      key: "last_name",
       align:'center'
    },
    {
      title: t('midName'),
      dataIndex: "patronymic",
      key: "patronymic",
      align:'center'
    },
    {
      title: t('birth'),
      dataIndex: "birth_date",
      key: "birth_date",
      align:'center'
    },
    {
      title: t('phoneNumber'),
      dataIndex: "phone",
      key: "phone",
      align:'center'
    },
    {
      title: t('edit'),
      dataIndex: "phone_edit",
      key: "phone_edit",
      align:'center'
    },
    {
      title:t('pasport'),
      dataIndex: "passport",
      key: "passport",
      align:'center',
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
    {
      title:t('edit'),
      dataIndex: 'action',
      key: 'action',
      align:'center'
  },
  ];

  // getTeacherList
  const getTeacherList = async (page, pageSize) => {
    setTableLoading(true);
    const body = {
      page,
      pageSize,
      search:searchText
    };
    const res = await api.get("api/admin/teacher/list", { params: body });

    try {
      if (res) {
        setData(
          res.data.data.map((item) => {
            return {
              ...item,
              key: item.id,
              passport: { series: item.series, number: item.number },
              action:<div 
              style={{display:'flex', justifyContent:'center',alignItems:'center'}}><Button  onClick={()=>handelPass(item.id)}>
               <MdPassword size='20px' style={{ marginRight:'10px'}}/><GrUpdate/></Button></div>,
               phone_edit:<div  style={{display:'flex', justifyContent:'center',alignItems:'center'}}>
                <Button onClick={()=>editPhone(item.id)}><FiEdit/></Button>
               </div>
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
    getTeacherList(1, 15);
  }, []);
  //search
  useEffect(()=>{
    getTeacherList()
  },[searchText])
  
  const textSearch = (e) => {
    const   value = e.target.value
    if (value.length > 3) {
        setSearchText(e.target.value)
    }
}
//edit Phone number
const editPhone=(id)=>{
  setEditModal(true)
  setPhoneId(id)
}
 const savePhone=(values)=>{
  const body={
    id:phoneId,
    phone:values.phone
  }
  api.post(`api/admin/teacher/update/user/phone`,body).then(res=>{
    if(res){
      notification.success({
        message:'telefon raqam yangilandi',
        icon:null
      })
    }
    else{
      notification.error({
        message:'qayta urnib ko`ring',
        icon:null
      })
    }
  })
}
//edit password
const handelPass = (id) => {
  form.setFieldValue('password','123456');
  form.setFieldValue('password_confirmation','123456');
  setModalOpen(true);
  setEditId(id);
}
const savePassword=()=>{
  const values = form.getFieldsValue()
  if (values.password==values.password_confirmation) {
    setCurrent(current +1)
    const body = {
         password: values.password,
         password_confirmation:values.password_confirmation,
    }
    api.post(`api/admin/teacher/update/user/password/${editId}`,body)
    .then(res=>{
        if (res) {
          setModalOpen(false)
            form.resetFields();
            notification.success({
              message:'parol yangilandi',
              icon:null
            })
        }
        else{
          notification.error({
            message:'qayta urnib ko`ring',
            icon:null
          })
        }
    })       
} 
}
const onSteps=()=>{
  setOnStep(true)
  setCurrent(current +1)
}
const offSteps=()=>{
  setModalOpen(false)
  setOnStep(false)
  setCurrent(current==0)
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
              {t('addition')}
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
              <Form.Item name="first_name" label={t('name')}>
                <Input disabled  />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="last_name" label={ t('surName')}>
                <Input disabled  />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
              <Form.Item name="patronymic" label={ t('midName')}>
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
                label={t('passportNumber')}
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
            label={t('pinfl')}
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
                mask:`${ /^(998)([0-9]{9})$/}`
              },
            ]}
          >
            <Input placeholder="998901234567" disabled={loading} />
          </Form.Item>
          <Form.Item name={"birth_date"} label={t('birth')}>
            <DatePicker disabled style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name='branch_id' label={t('branchName')}>
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
      {modalOpen && 
        <Modal
                open={modalOpen}
                width={600}
                onCancel={()=>{setModalOpen(false);setCurrent(current==0);setOnStep(false) }}
                footer={
                    <div style={{display:`${onstep?"block":"none"}`}}>
                        <Button className="btn btn-danger" onClick={offSteps}>{t('notSave')}</Button>
                        <Button className="btn btn-success"  onClick={savePassword} on >{t('save')}</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    style={{margin:"8px"}}
                    >
                    <Steps  current={current}>
                        <Steps.Step title={t('newPassword')}  />
                        <Steps.Step title={t('confirmation')}/>
                        <Steps.Step title={t('finishPassword')} />
                    </Steps>
                     <Form.Item name='password' label="Parol" style={{marginTop:'30px'}} rules={[{require:true,message:'yagi parolni kiriting',whitespace:true }]} >
                        <Input /> 
                        <Button  style={{display:`${onstep?"none":"inline-block"}`,
                        margin:'20px 5px 0px 400px'}} onClick={onSteps}>next</Button>
                    </Form.Item>
                    <Form.Item style={{display:`${onstep?"block":"none"}`}} 
                    name='password_confirmation' label="Parolni takrorlang" rules={[{require:true,whitespace:true}]} >
                        <Input  />
                    </Form.Item>
                </Form>
            </Modal>
            }
            {editModal && 
             <Modal
                open={editModal}
                onCancel={()=>setEditModal(false)}
                footer={
                  <div>
                       <Button className="btn btn-danger" onClick={()=>setEditModal(false)}>{t('notSave')}</Button>
                        <Button className="btn btn-success" htmlType="submit" form="savePhone"   on >{t('save')}</Button>
                  </div>
                }>
                <Form
                    form={form}
                    onFinish={savePhone}
                    layout="vertical"
                    name="basic"
                    id="savePhone"
                    width={450}
                >
                     <Form.Item name={'phone'} label={t('typingPhoneNumber')}  rules={[{require:true,min:12,max:12,whitespace:true }]} >
                        <Input placeholder="9989012345678"/> 
                    </Form.Item>
                </Form>
            </Modal>
            }
      <ToastContainer />
    </div>
  );
};
export default AdminTeacherList;
