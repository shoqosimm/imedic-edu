import { Button, Card, Form,Input, message } from "antd";
import React ,{useEffect,useState} from "react";
import ReactQuill from "react-quill";
import { useParams,useLocation,useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import "react-quill/dist/quill.snow.css";
import { configConsumerProps } from "antd/es/config-provider";
import { Notification } from "../../Notification/Notification";


const EditSubject = () => {
    const params = useParams();
    const [title, setTitle] = useState('');
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location,"location");
    useEffect(() => {
        getSubject(params.id);
    }, [])
    const getSubject = (id) => {
        api
            .get(`api/teacher/course-subject/show/${id}`)
            .then((res) => {
                console.log(res.data.data);
                if (res.data.data.subject_type=='topic') {
                    form.setFieldsValue({
                        name: res.data.data.name,
                        content: res.data.data.content,
                        teaser: res.data.data.teaser,
                    })
                }else{
                    form.setFieldsValue({
                        name: res.data.data.name,
                        count_test: res.data.data.count_test,
                        time: res.data.data.time,
                        right_test: res.data.data.right_test,
                        resubmit: res.data.data.resubmit,
                        teaser: res.data.data.teaser,
                    })
                }   
                
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const onFinish = (values) => {
        let body = {};
        if (location.state.message.subject_type=='topic') {
            body.subject_type = 'topic';
            body.name = values.name;
            body.content = values.content;
            body.teaser = values.teaser;
        }else{
            body.subject_type = 'test';
            body.name = values.name;
            body.count_test = values.count_test;
            body.time = values.time;
            body.right_test = values.right_test;
            body.resubmit = values.resubmit;
            body.teaser = values.teaser;
        }
        api
            .post(`api/teacher/course-subject/update/${params.id}`, body)
            .then((res) => {

                if (res.data.success === 1) {
                    Notification();
                    setTimeout(() => {
                        navigate(`/teacher/course/${location.state.message.course_id}/view`);
                    },1000)
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(() => {
        let text = {};
        if (location.state.message.subject_type=='topic') {
            text = "Редактирование темы"; 
        }else{
            text = "Редактирование test";
        }
        setTitle(text);
    }, [])





    return (
        <>
            <Card title={title}>
                <Form 
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 800 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}

                >
                    {location.state.message.subject_type=='topic' ? (
                        <>
                        <Form.Item label="заголовок" >
                            <Form.Item name="name" >
                                <Input placeholder="" />
                            </Form.Item>
                            </Form.Item>
                            <Form.Item label="контент" >
                            <Form.Item name="content" >
                                <ReactQuill theme="snow" />
                            </Form.Item>
                            </Form.Item>
                            
                            
                        </>
                        
                    ):(
                    <>
                            <Form.Item label="заголовок" >
                                <Form.Item name="name">
                                    <Input placeholder="Test name" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="количество вопросов" >
                                <Form.Item name="count_test">
                                    <Input placeholder="Test count" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="время" >
                                <Form.Item name="time" >
                                    <Input placeholder="Test Vaqti (Munit)" />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="правильные ответы" >
                                <Form.Item name="right_test" >
                                    <Input placeholder="O`tish soni " />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item label="повторный тест" >
                                <Form.Item name="resubmit" >
                                    <Input placeholder="Qayta topshirish vaqti" />
                                </Form.Item>
                            </Form.Item>
                            
                    </>)}
                            <Form.Item label="тизер" >
                                <Form.Item name="teaser" >
                                    <Input placeholder="тизер" />
                                </Form.Item>
                            </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Редактировать</Button>
                    </Form.Item>
                </Form>
            </Card>
        </>
    )
}
export default EditSubject;