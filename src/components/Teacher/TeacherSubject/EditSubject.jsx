import { Button, Card, Form,Input, message } from "antd";
import React ,{useEffect} from "react";
import ReactQuill from "react-quill";
import { useParams,useLocation,useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";
import "react-quill/dist/quill.snow.css";
import { configConsumerProps } from "antd/es/config-provider";
import { Notification } from "../../Notification/Notification";


const EditSubject = () => {
    const params = useParams();
    const [form] = Form.useForm();
    const location = useLocation();
    const navigate = useNavigate();
    console.log(location,"location");
    useEffect(() => {
        getSubject(params.id);
    }, [])
    const getSubject = (id) => {
        api
            .get(`api/teacher/course-subject/show/${params.id}`)
            .then((res) => {
                console.log(res.data.data);
                form.setFieldsValue({
                    name: res.data.data.name,
                    content: res.data.data.content,
                    teaser: res.data.data.teaser,
            })
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const onFinish = (values) => {
        values.subject_type = 'topic';
        api
            .post(`api/teacher/course-subject/update/${params.id}`, values)
            .then((res) => {

                if (res.data.success === 1) {
                    Notification();
                    setTimeout(() => {
                        navigate(`/teacher/course/${location.state.message}/view`);
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




    return (
        <>
            <Card title="Редактирование предмета">
                <Form 
                    name="basic"
                    form={form}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}

                >
                    
                        <Form.Item name="name" >
                            <Input placeholder="" />
                        </Form.Item>
                    
                        <Form.Item name="content" >
                            <ReactQuill theme="snow" />
                        </Form.Item>
                        <Form.Item name="teaser" >
                            <Input />
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