import { Button, Card, Form,Input, Space } from "antd";
import React,{useState} from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../../utils/api";

const CreateTest = () => {
    const [textanswer, setTextanswer] = useState('Ответ 1');
    const [number, setNumber] = useState(3);
    const param = useParams();
    console.log(param);
    const [answer, setAnswer] = useState([
        {
            id:0,
            text:"правильный ответ"
        },
        {
            id:1,
            text:`неправильный ответ`
        },
        {
            id:2,
            text:`неправильный ответ`
        }
    ]);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        values.course_subject_id = parseInt(param.id);
        
        api
            .post(`api/teacher/test/add`, values)
            .then((res) => {
                console.log(res);
            }
            )
            .catch((err) => {
                console.log(err);
            }
            );
    }
    const addAnswer = () => {
        setTextanswer(textanswer + 1);
    }
    const AddForm = (id) => {

        setNumber(number + 1);
        setAnswer([...answer, 
            {
                id:parseInt(number),
                text:`неправильный ответ`,
            }
        ]);
    }
    const DeleteField = (id) => {
        setNumber(number - 1);
        setAnswer(answer.filter(item => item.id !== id));
    }



    return (
        <>
            <Card title="Добавить тест">
                <Card>
                    <Form
                        form={form}
                        name="createTest"
                        onFinish={onFinish}
                        layout="vertical"


                    >
                        <Form.Item label="Вопрос">
                            <Form.Item name="question">
                                <Input placeholder="Вопрос теста" />
                            </Form.Item>
                        </Form.Item>
                        {answer.map((item,index) => {
                            
                            return (
                                <>
                                <Form.Item label={item.text } key={index} >
                                    <Form.Item name={`answer[${item.id}]`}>
                                        <Input placeholder={item.text} />
                                    </Form.Item>
                                </Form.Item>
                                {index > 1 ? <Button onClick={() => DeleteField(item.id)}>Delete</Button> : null}
                                </>
                            )
                        }
                        )}
                        
                        <Form.Item>
                            <Button type="primary" onClick={()=>AddForm(answer)}>Добавить ответ</Button>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Добавить тест</Button>
                        </Form.Item>
                       
                        
                    </Form>
                </Card>
            </Card>
        </>
    );
    }
    export default CreateTest;