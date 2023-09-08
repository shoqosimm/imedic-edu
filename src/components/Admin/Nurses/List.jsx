import { Button, Form, Input, Modal, Table } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../../utils/api";

const List = () => {
    const [form] = Form.useForm();
    const [nurse,setNurse] = useState([])
    const [searchText,setSearchText] = useState('')
    const [tableLoading, setTableLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId,setEditId] = useState(null)
    
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
    const getNurses = async () => {
        const body = {
            search:searchText
        }
        api.get('api/admin/nurse/list')
        .then(res=>{
            if (res) {
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
    }

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
    const savePassword = () => {
        const values = form.getFieldsValue()
        if (values.password==values.password_confirmation) {
            const body = {
                id:editId,
                password:values.password,
                password_confirm:values.password_confirmation
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


    return (
        <div>
            <Input.Search placeholder="Qidiruv" onChange={search} />
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
                onCancel={() => setIsModalOpen(false)}
                footer={
                    <div>
                        <Button className="btn btn-danger" onClick={() => setIsModalOpen(false)}>Bekor qilish</Button>
                        <Button className="btn btn-success" onClick={savePassword} >Saqlash</Button>
                    </div>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    initialValues={{ remember: true }}
                >
                    <Form.Item name={'password'} label="Parol"  >
                        <Input />
                    </Form.Item>
                    <Form.Item name={'password_confirmation'} label="Parolni takrorlang"  >
                        <Input />
                    </Form.Item>
                </Form>

            </Modal>
            }
            {}
        </div>
    )}
    export default List;