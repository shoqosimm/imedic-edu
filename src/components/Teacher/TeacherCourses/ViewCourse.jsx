import { Card, Space, Table } from "antd";
import React ,{useEffect,useState } from "react";
import { BiPlus } from "react-icons/bi";
import { useParams,Link } from "react-router-dom";
import { api } from "../../../utils/api";

const ViewCourse = () => {
    const params = useParams();
    const [course, setCourse] = useState([]);
    useEffect(() => {
        getCourse(params.id);
    }, [])
    const getCourse = (id) => {
        api
            .get(`api/teacher/course/show/${id}`)
            .then((res) => {
                setCourse(res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
        },
    ];

    return (
        <>
        
            <Card title={course.name}>
                <Card title="Список" extra={<Link to={`/teacher/subject/create/${course.id}`}><BiPlus/> Boshlash</Link>} >
                    <Table
                        columns={columns}
                    />
                    
                </Card>
            </Card>
        </>
    )
}
export default ViewCourse;