import { Button, Card, Form, Input, Modal } from "antd";
import React ,{useState,useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../../../utils/api";
import { useParams } from "react-router-dom";
const CreateSubject = () => {

    const [openModal, setOpenModal] = useState(true);
    const [type, setType] = useState(false);
    const [contentValue, setContentValue] = useState("");
    const [form] = Form.useForm();
    const params = useParams();

    useEffect(() => {
        const handleModal = () => {
            if (type === false) {
                setOpenModal(true);
            }else{
                setOpenModal(false);
            }
        }
        handleModal();
    }, [type])
    const onFinish = (values) => {
        values.content = contentValue;
        values.course_id = parseInt(params.id);
        values.subject_type = "topic";

        console.log('====================================');
        console.log(values);
        console.log('====================================');
        
        api
            .post("/api/teacher/course-subject/add", values)
            .then((res) => {
                
                    if (res.data.success) {
                        console.log(res.data);
                    }
                
            }
            )
            .catch((err) => {
                console.log(err);
            }
            );

    }
  return (
    <>
        <Modal
            centered
            open={openModal}
            okButtonProps={{ disabled: true }}
            cancelButtonProps={{ disabled: true }}
        >
            <Card title="Create Subject">
                   <Button onClick={()=>setType(0)} >Subject</Button> 
                   <Button onClick={()=>setType(1)} >Test</Button> 
            </Card>

        </Modal>
        <Card loading={openModal} >
        {type==0 ? 
            <Card title="Create Subject">
                <Form
                    form={form}
                     name="create-topic"
                     layout="vertical"
                     initialValues={{
                         modifier: "public",
                     }}
                     onFinish={onFinish}
                >
                    <Form.Item name="name" >
                        <Input placeholder="Subject name" />
                    </Form.Item>
                    <Form.Item name="content">
                        <ReactQuill theme="snow"  value={contentValue} onChange={setContentValue} />
                    </Form.Item>
                    <Form.Item name="teaser">
                        <Input placeholder="тизер" />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" >Создавать</Button>
                    </Form.Item>
                </Form>
            </Card>
                    
         :(
            <Card title="Create Test">
                <Form
                   
                >
                    <Form.Item>
                        <Input placeholder="Test name" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Test description" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Test time" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Test count question" />
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder="Test count question" />
                    </Form.Item>
                </Form>
            </Card>

         )}
        </Card>
       
        

    </>
    );
};
export default CreateSubject;