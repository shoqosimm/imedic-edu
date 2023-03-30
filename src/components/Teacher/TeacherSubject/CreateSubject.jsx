import { Button, Card, Form, Input, Modal } from "antd";
import React ,{useState,useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../../../utils/api";
import { useParams } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { Notification } from "../../Notification/Notification";
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
        let body = {}
        if (type === 0) {
            body.content = contentValue;
            body.course_id = parseInt(params.id);
            body.subject_type = "topic";
            body.name = values.name;
            body.teaser = values.teaser;
        }else{
            body.course_id = parseInt(params.id);
            body.subject_type = "test";
            body.name = values.name;
            body.count_test = values.count_test;
            body.right_test  = values.right_test;
            body.time = values.time;
            body.resubmit = values.resubmit;
            body.teaser = values.teaser;
        }
        api
            .post("/api/teacher/course-subject/add", body)
            .then((res) => {
                    if (res.data.success) {
                        setTimeout(() => {
                            Notification("success", res.data.message);
                        }, 1000);
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
       
            <Card title="Create Subject">
                <Form
                    form={form}Create Test
                     name="create-topic"
                     layout="vertical"
                     initialValues={{
                         modifier: "public",
                     }}
                     onFinish={onFinish}
                >
                     {type==0 ? (
                        <>
                            <Form.Item name="name" >
                                <Input placeholder="Subject name" />
                            </Form.Item>
                            <Form.Item name="content">
                                <ReactQuill theme="snow"  value={contentValue} onChange={setContentValue} />
                            </Form.Item>
                            <Form.Item name="teaser">
                                <Input placeholder="тизер" />
                            </Form.Item>
                            
                        </>
                     ):(
                        <>
                            <Form.Item name="name">
                                <Input placeholder="Test name" />
                            </Form.Item  >
                            <Form.Item name="count_test">
                                <Input placeholder="Test count" />
                            </Form.Item>
                            <Form.Item name="time" >
                                <Input placeholder="Test Vaqti (Munit)" />
                            </Form.Item>
                            <Form.Item name="right_test" >
                                <Input placeholder="O`tish soni " />
                            </Form.Item>
                            <Form.Item name="resubmit" >
                                <Input placeholder="Qayta topshirish vaqti" />
                            </Form.Item>
                            <Form.Item name="teaser">
                                <Input placeholder="тизер" />
                            </Form.Item>
                            
                        </>    

                    )}
                    <Form.Item >
                                <Button type="primary" htmlType="submit" >Создавать</Button>
                            </Form.Item>
                </Form>
            </Card>
                    
         
            
        </Card>
       
        

    </>
    );
};
export default CreateSubject;