import { Card, Form, Input, Select, Button } from "antd";
import React, { useState, useEffect } from "react";
import { api } from "../../../utils/api";
import { useParams, useNavigate } from "react-router-dom";

const EditCourse = () => {
    const [category, setCategory] = useState([])
    const [saveLoading, setSaveLoading] = useState(false)
    const [form] = Form.useForm();
    const params = useParams();
    const navigate = useNavigate();
    const onFinish = (values) => {
        setSaveLoading(true)

        let body = {
            name: values.title,
            category_id: values.category
        }
        api
            .post(`api/teacher/course/update/${params.id}`, body)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.success) {
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
        getItemCourse(params.id)

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
    const getItemCourse = (id) => {
        api
            .get(`api/teacher/course/show/${id}`)
            .then((res) => {
                form.setFieldsValue({
                    title: res.data.name,
                    category: res.data.category_id
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }


    return (
        <>
            <h1>Редактирование курса</h1>

            <Card>
                <Form form={form} name="edit-course" onFinish={onFinish}>
                    <Form.Item name="title" >
                        <Input placeholder="Название курса" rules={[{ required: true, message: 'Пожалуйста, введите название вашего курса!' }]} />
                    </Form.Item>
                    <Form.Item name="category" >
                        <Select options={category} placeholder="Выберите категорию" style={{ width: '100%' }} rules={[{ required: true, message: 'Пожалуйста, выберите категорию вашего курса!' }]} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={saveLoading}>
                            Редактировать
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </>

    )
}
export default EditCourse;