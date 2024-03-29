import { Button, Form, Input, Modal, Steps, Table } from "antd";
// import { EditButton } from "@refinedev/antd"
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../../utils/api";
import { t } from "i18next";
import DeleteNurse from "./deleteNurse";
import Addnurse from "./addNurse";

const List = () => {
    const [form] = Form.useForm();
    const [nurse,setNurse] = useState([])
    const [searchText,setSearchText] = useState(null)
    const [tableLoading, setTableLoading] = useState(true);
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
            search:searchText
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
                        <Button   onClick={()=>editNurse(item.id)}> {t('edit')}</Button>
                        <Button onClick={()=>deleteNurse(item?.id)} >Delete</Button>
                        {/* <EditButton>delete</EditButton> */}
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

      const [deleteModal,setDeleteModal] = useState(false)
      const [deleteItemId,setDeleteItemId]  =useState(null);
      const [addNurseModal,setAddNurseModal] = useState(false)

      const deleteNurse =  (id)=>{
        setDeleteModal(true);
        setDeleteItemId(id)
      }

    const columns = [
        {
            title:t('fullName'),
            dataIndex: 'name',
            key: 'name'
        },
        {
            title:t('phoneNumber') ,
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: t('action'),
            dataIndex: 'action',
            key: 'action'
        },
    ];
    
    const search = (e) => {
        
        const value = e.target.value
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

    const savePassword = () => { 
         setCurrent()
        const values = form.getFieldsValue()
        if (values.password==values.password_confirmation) {
            const body = {
                id:editId,
                password:values.password, 
                password_confirmation:values.password_confirmation, 
            }
            api.post(`api/admin/teacher/update/user/password/${editId}`,body)
            .then(res=>{
                if (res) {
                    setEditId(null);
                    setIsModalOpen(false);
                    setCurrent(current =0);
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

  const addNurse = () =>{
    setAddNurseModal(true)
} 
    return (
        <div>
            <Button className="add__btn" onClick={()=>addNurse()}>Qushish</Button>
            <Input placeholder={t('search')} onChange={search} />
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
                    <div >
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
                    onFinish={savePassword}
                    
                >
                    
                     <Form.Item name={'password'} style={{marginTop:30}}  rules={[{require:true,message:t('newParol'),whitespace:true,max:6,min:6 }]} >
                        <Input value="123456" /> 
                    </Form.Item>

                    <Form.Item  
                       name={'password_confirmation'} label={t('confirmation')} rules={[{require:true,whitespace:true}]} >
                        <Input value="123456"  />
                    </Form.Item>
                </Form>
            </Modal>
            }

            {deleteModal && 
                <DeleteNurse deleteModal={deleteModal} id={deleteItemId} setDeleteModal ={setDeleteModal}/>
            }

            {
                addNurseModal && 
                  <Addnurse addNurseModal={addNurseModal} setAddNurseModal={setAddNurseModal}/>
                  }

            <Addnurse/>
        </div>
    )}
    export default List;
