import { Form, Input, Modal } from "antd"
import { api } from "../../../utils/api";

const AddBranch = ({showModal,setShowModal})=>{
    const [form] = Form.useForm();

    const addBranch = ()=>{
        var body = form.getFieldsValue();
        if (body.title) {
            api.post('admin/branch/add',body).then
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