import { Card, Form,Input } from "antd";
import React,{useState} from "react";

const CreateTest = () => {
    const [textanswer, setTextanswer] = useState('Ответ 1');
    const [answer, setAnswer] = useState([]);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log(values);
    }
    const addAnswer = () => {
        setTextanswer(textanswer + 1);
    }


    return (
        <>
            <Card title="Добавить тест">
                <Card>
                    <Form>
                        <Form.Item label="Вопрос">
                            <Form.Item name="question">
                                <Input placeholder="Вопрос теста" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label={textanswer}>
                            <Form.Item name="answer[]">
                                <Input placeholder={textanswer} />
                            </Form.Item>
                        </Form.Item>
                       
                        
                    </Form>
                </Card>
            </Card>
        </>
    );
    }
    export default CreateTest;