import { Button, Form, Input, Modal, Steps, Table } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../../utils/api";
import { t } from "i18next";
const List = () => {
    const [form] = Form.useForm();
    const [nurse,setNurse] = useState([])
    const [searchText,setSearchText] = useState('')
    const [tableLoading, setTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId,setEditId] = useState(null)
    const[current,setCurrent]=useState(0)
    const [onstep,setOnStep]=useState(false)
    const [pagination,setPagination] = useState({
        page:1,
        pageSize:10,
        total:100
    })
    useEffect(()=>{
        getListCategory()
    },[searchText])
    const getListCategory = async (page, pageSize) => {
        setTableLoading(true);
        const body = {
            page: page,
            pageSize: pageSize,
        };
        const res = await api.get("api/admin/nurse/list", { params: body });
        try {
          if (res) {
            setTableLoading(false);
            setNurse(
              res.data.data.map((item,index) => {
                return {
                    key:index,
                    id:item.id,
                    name:item.last_name + ' ' + item.first_name + ' ' + item.patronymic,
                    phone:item.phone,
                    action:<div>
                        <Button className="btn btn-danger" onClick={()=>editNurse(item.id)} >Tahrirlash</Button>
                    </div>
                };
              })
            );
            setPagination({
                page: res.data.page,
              pageSize: res.data.per_page,
              total: res.data.total,
            });
          }
        } catch (err) {
          console.log(err, "err");
          setTableLoading(false);
        } finally {
          setTableLoading(false);
        }
      };
    useEffect(()=>{
          const body = {
            search:searchText
        }
        api.get('api/admin/nurse/list')
        .then(res=>{
            if (res) {
                console.log(res)
                setNurse(
                    res.data.data.map((item,index)=>{
                        return{
                            key:index,
                            id:item.id,
                            name:item.last_name + ' ' + item.first_name + ' ' + item.patronymic,
                            phone:item.phone,
                            action:<div>
                                <button className="btn btn-danger">O'chirish</button>
                            </div>
                        }
                    })
                )
                setPagination({
                    page: res.data.page,
                    pageSize: res.data.per_page,
                    total: res.data.total,
                  });
            }
        })
    },[])
    console.log(searchText)
    const columns = [
        {
            title: 'F.I.O',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Telefon',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Amallar',
            dataIndex: 'action',
            key: 'action',
        },
    ];
    const search = (e) => {
        const   value = e.target.value
        if (value.length > 3) {
            setSearchText(e.target.value)
        }
    }
    const editNurse = (id) => {
        form.setFieldValue('password','123456');
        form.setFieldValue('password_confirmation','123456');
        setIsModalOpen(true);
        setEditId(id);
    }
    const savePassword = () => {  setCurrent(current +1)
        const values = form.getFieldsValue()
        if (values.phone==values.phone_confirmation) {
            const body = {
                id:editId,
                phone:values.password,
                phone_confirm:values.phone_confirmation
            }
            api.post('api/admin/nurse/update/password',body)
            .then(res=>{
                if (res) {
                    setEditId(null);
                    setIsModalOpen(false);
                    form.resetFields();
                }
            })       
        } 
    }
  //steps 
  const onSteps=()=>{
    setOnStep(true)
    setCurrent(current +1)
  }
  const offSteps=()=>{
    setIsModalOpen(false)
    setOnStep(false)
    setCurrent(current==1)
  }
    return (
        <div>
            <Input placeholder="Qidiruv" onChange={search} />
            <Table
                loading={tableLoading}
                columns={columns}
                dataSource={nurse}
                pagination={{
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) => {
                      getListCategory(page, pageSize);
                    },
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                  }}
            />
            {isModalOpen && 
            <Modal
                open={isModalOpen}
                onCancel={()=>setIsModalOpen(false)}
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
                    width={500}
                    
                >
                    <Steps  current={current}>
                        <Steps.Step title="password"  />
                        <Steps.Step title="confirmation"/>
                        <Steps.Step title="finsh" />
                    </Steps>
                     <Form.Item name={'pahone'} label="Parol"  rules={[{require:true,message:'yagi parolni kiriting',min:12,max:12,whitespace:true }]} >
                        <Input placeholder="998901234567" /> 
                        <Button  style={{display:`${onstep?"none":"inline-block"}`,
                        margin:'20px 5px 0px 400px'}} onClick={onSteps}>next</Button>
                    </Form.Item>
                    <Form.Item style={{display:`${onstep?"block":"none"}`}} 
                    name={'pahoe_confirmation'} label="Parolni takrorlang" rules={[{require:true,min:12,max:12,whitespace:true}]} >
                        <Input  />
                    </Form.Item>
                </Form>
            </Modal>
            }
        </div>
    )}
    export default List;