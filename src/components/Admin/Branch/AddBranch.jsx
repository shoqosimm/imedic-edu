import { Form, Input, Modal } from "antd"
import { api } from "../../../utils/api";
import { useEffect } from "react";
import { useState } from "react";

const AddBranch = ({showModal,setShowModal,itemRecord})=>{
    const [form] = Form.useForm();
    const [edit,setEdit] = useState(false)
    useEffect(()=>{
        form.setFieldsValue(itemRecord);
        setEdit(true);
    },[itemRecord])
    const addBranch = ()=>{
        var body = form.getFieldsValue();
        if (body.title) {
            if (edit) {
            api.put(`api/admin/branch/update/${itemRecord.id}`,body)
            .then(
                res=>{
                        setShowModal(false);
            }).catch(res=>{console.log(res);})
            }else{
            api.post('api/admin/branch/add',body)
            .then(
                res=>{if (res.data.data.success==1) {
                        setShowModal(false);
                    }}).catch(res=>{console.log(res);})
            }
           
        }
    }
    return (<>
        <Modal
            open={showModal}
            onCancel={()=>setShowModal(false)}
            okText="Saqlash"
            cancelText="Bekor qilish"
            onOk={addBranch}
        >
            <Form
                form={form}
                size="default"
                layout="vertical"
            >
                <Form.Item name="title" label="Filial nomi" >
                    <Input  />
                </Form.Item>
                <Form.Item name={'director'} label="Filial rahbari" >
                    <Input/>
                </Form.Item>
                <Form.Item name={'phone'} label="Filial raqami"  >
                    <Input/>
                </Form.Item>
                <Form.Item name={'branch_name'} label="Filial to`liq nomlanishi"  >
                    <Input/>
                </Form.Item>

            </Form>
        </Modal>
    </>)
}
export default AddBranch