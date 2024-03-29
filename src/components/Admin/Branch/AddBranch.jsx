import { Form, Input, Modal } from "antd"
import { api } from "../../../utils/api";
import { useEffect } from "react";
import { useState } from "react";
import { t } from "i18next";
const AddBranch = ({showModal,setShowModal,itemRecord})=>{
    const [form] = Form.useForm();
    const [edit,setEdit] = useState(false)
    useEffect(()=>{
        form.setFieldsValue(itemRecord);
        setEdit(true);
    },[itemRecord?.id])
    const addBranch = ()=>{
        var body = form.getFieldsValue();
        if (body.title) {
            if (itemRecord?.id) {
            api.put(`api/admin/branch/update/${itemRecord.id}`,body)
            .then(res=>{
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
            okText={t('save')}
            cancelText={t('notSave')}
            onOk={addBranch}
        >
            <Form
                form={form}
                size="default"
                layout="vertical"
            >
                <Form.Item name="title" label={t('branchName')} >
                    <Input  />
                </Form.Item>
                <Form.Item name={'director'} label={t('branchManager')} >
                    <Input/>
                </Form.Item>
                <Form.Item name={'phone'} label={t('branchPhoneNumber')}  >
                    <Input/>
                </Form.Item>
                <Form.Item name={'branch_name'} label={t('branchFullName')}  >
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    </>)
}
export default AddBranch