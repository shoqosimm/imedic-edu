import { Button, Card, Form, Input, Select } from "antd";
import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/api";

const CreateCourse = () => {
    const [category, setCategory] = useState([])
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const onFinish = (values) => {
        let body = {
            name: values.title,
            category_id: values.category
        }
        api
            .post("/api/teacher/course/add", body)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.success) {
                        form.resetFields();
                        navigate("/teacher/course");

                    }
                }
            }
            )
            .catch((err) => {
                console.log(err);
            });
    }
    useEffect(() => {
        getCategory();

    }, [])
    const getCategory = () => {
        api
            .get("/api/select/category")
                .then((res) => {
                    setCategory( 
                    res.data.map((item) => {
                        return {
                            key: item.id,
                            value: item.id,
                            label: item.name
                        };
                    }))
                })
                .catch((err) => {
                    console.log(err);
                });
    }

    return (
        <>
            <h1>Создание курса</h1>
            <Card>
                <Form form={form} name="create-course" onFinish ={onFinish}>
                    <Form.Item name="title" > 
                        <Input placeholder="Название курса"  rules={[{ required: true, message: 'Пожалуйста, введите название вашего курса!' }]} />
                    </Form.Item>
                    <Form.Item name="category" >
                        <Select options={category}  placeholder="Выберите категорию"  style={{ width: '100%' }} rules={[{ required: true, message: 'Пожалуйста, выберите категорию вашего курса!' }]} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Создать
                        </Button>
                    </Form.Item>
                </Form>
                
            </Card>
        </>
        


    );
}
export default CreateCourse;