import { Card, Space, Table,Modal,Button} from "antd";
import React ,{useEffect,useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BiPencil, BiPlus, BiWindowOpen } from "react-icons/bi";
import { useParams,Link,useNavigate,useLocation } from "react-router-dom";
import { api } from "../../../utils/api";
import { Notification } from "../../Notification/Notification";

const ViewCourse = () => {
    const params = useParams();
    const [course, setCourse] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [ModalText, setModalText] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [idModal,setIdModal] = useState(null);
    let navigate = useNavigate();
    useEffect(() => {
        getCourse(params.id);
        getSubjects(params.id);
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
    const getSubjects = (id) => {
        api
            .get(`api/teacher/course-subject/list/${id}`)
            .then((res) => {
                setSubjects(
                    res.data.data.map((item) => {
                        return {
                            key: item.id,
                            name: item.name,
                            teaser: item.teaser,
                            subject_type:item.subject_type,
                        }
                    })
                );
            })
            .catch((err) => {
                console.log(err);
            });
    }
    const showModal = (record) => {
        setModalOpen(true);
        setModalText(`Siz xaqiqatxam ${record.name} mavzusini o'chirmoqchimisiz?`);
        setIdModal(record.key);

    }
    
    const edit = () => {
        navigate(`/teacher/subject/edit/${params.id}`,{state:{message:params.id}});
    }
    
    const columns = [
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'teaser',
            key: 'teaser',
        },
        {
            title: 'Действие',
            dataIndex: 'action',
            key: 'action',
            render: (text, record) => (
                record.subject_type=="topic" ?(
                    <Space size="middle">
                   <Button onClick={edit}><BiPencil/></Button>
                    <Button  onClick={()=>showModal(record)}>
                        <AiFillDelete/>
                    </Button>
                    <Button onClick={()=>view(record)} ><BiWindowOpen/></Button>
                </Space>
                ):(
                    <Space size="middle">
                   <Button onClick={edit}><BiPencil/></Button>
                    <Button  onClick={()=>showModal(record)}>
                        <AiFillDelete/>
                    </Button>
                    <Button onClick={()=>view(record)} ><BiWindowOpen/></Button>
                    <Button onClick={()=>navigate(`/teacher/subject/create/${record.key}`)}><BiPlus/></Button>
                </Space>
                )
                
            ),
        },
    ];
    const view = (record) => {
        navigate(`/teacher/subject/view/${record.key}`);
    }
    const handleOk = () => {
        setConfirmLoading(true);
        setModalText('Mavzu o`chirilmoqda...');
        api
            .get(`/api/teacher/course-subject/active/${idModal}`)
            .then((res) => {
                if (res.data.success) {
                    setTimeout(() => {
                        setModalOpen(false);
                        setConfirmLoading(false);
                        Notification();
                    }, 2000);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    return (
        <>
        
            <Card title={course.name}>
                <Card title="Список" extra={<Link to={`/teacher/subject/create/${course.id}`}><BiPlus/> Boshlash</Link>} >
                    <Table
                        columns={columns}
                        dataSource={subjects}
                    />
                    
                </Card>
            </Card>
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={handleOk}
                confirmLoading={confirmLoading}
            >
                <p>{ModalText}</p>
            </Modal>
        </>
    )
}
export default ViewCourse;