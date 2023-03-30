import { Alert, Button, Card, Modal, Row, Table } from 'antd';
import React,{useEffect, useState} from 'react';
import { AiFillDelete } from 'react-icons/ai';
import {  BiPencil } from 'react-icons/bi';
import { TbEyeTable } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { api } from '../../../utils/api';

const TeacherCourses = () => {
  const [course, setCourse] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [ModalText, setModalText] = useState('Вы уверены, что хотите удалить курс?');
  const [idModal, setIdModal] = useState(null);
  const columns = [
    {
      title: 'Название курса',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Действия',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <Row>
          <Link to={`/teacher/course/${record.key}/edit`}><BiPencil/></Link>
          <Button type="primary" onClick={()=>{showModal(record)}}>
            <AiFillDelete/>
          </Button>
          <Link to={`/teacher/course/${record.key}/view`}><TbEyeTable/></Link>
        </Row>
      ),
    },
  ];
  const showModal  = (value) => {
      setModalOpen(true);
      let text = "Siz xaqiqatxamen " + value.name + " kursini o'chirmoqchimisiz?";
      setModalText(text);
      setIdModal(value.key);
  }
  const handleOk = () => {
    setConfirmLoading(true);
    setModalText('Kurs o`chirilmoqda...');
    api
      .get(`api/teacher/course/active/${idModal}`)
      .then((res) => {
          if (res.data.success) {
            setTimeout(() => {
              setModalOpen(false);
              setConfirmLoading(false);
            }, 2000);
          }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getCourse();
  }, [])
  const getCourse = () => {
    api
      .get("api/teacher/course/list")
      .then((res) => {
        if (res.status === 200) {
         
            setCourse(
              res.data.data.map((item) => {
                return {
                  key: item.id,
                  name: item.name,
                  category: item.category.name,
                };
              })
            );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <h1>Список курсов</h1>
      <Link to="/teacher/course/create" >Создать курс</Link>
      <Card>
        <Table
          columns={columns}
          dataSource={course}
        />
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
      
  );
};

export default TeacherCourses;