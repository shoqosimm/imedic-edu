import { Card } from "antd";
import React,{useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../utils/api";


const ViewSubject  = () => {

    const param = useParams();
    const [subject, setSubject] = useState([]);
    useEffect(() => {
        getSubject(param.id);
    }, [])

    const getSubject = (id) => {
        api
            .get(`api/teacher/course-subject/show/${id}`)
            .then((res) => {
                setSubject(res.data.data);
                console.log(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
console.log(subject);
    return (
        <>
            <Card title="Просмотреть тему">
                <Card title="Тема" centered>
                    <p>Тема: TEst</p>
                    </Card>
                    <Card title="" centered>
                    <p>Subject Malumotlari chiqarilishi kerak </p>
                    </Card>

            </Card>
        </>

    )
}
export default ViewSubject;