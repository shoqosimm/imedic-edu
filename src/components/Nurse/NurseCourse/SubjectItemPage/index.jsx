import { Breadcrumb, Button, Card, Col, message, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import "./style.scss";
import { BiHome } from "react-icons/bi";
import { Link, useParams,useLocation } from "react-router-dom";
import { api } from "../../../../utils/api";
import { Notification } from "../../../Notification/Notification";

const SubjectItemPage = () => {
  const param = useParams();
  const location = useLocation();
  const [addCours, setAddCours] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [addCourseText, setAddCourseText] = useState();
  const [subject, setSubject] = useState({
    id: "1",
    name: "Web dasturlash haqida",
    teaser:
      "AngularJS, ReactJS va VueJS JavaScript dasturlash tiliga asoslangan bo‘lib, ular yordamida veb saytlarni yanada takomillashtirish, qo‘shimcha imkoniyatlar qo‘shish va bu o‘zgartirishlarni dasturchi o‘ylagandan ham oson usulda amalga oshirish mumkin. ",
    course: "Web Dasturlash",
    content:
      "HTML va CSS veb sahifalar asosini tashkil qiladi. HTML saytda aynan nimalar joylashishi kerakligiga mas’ul bo‘lsa (matn, rasm, video), CSSda ularning qaysi tartibda joylashuvi va qanday ko‘rinishda bo‘lishi yozib chiqiladi. Sayt foydalanuvchilarga ko‘rinadigan elementlar HTML va CSSda tuzilgani uchun bu ikkisisiz sayt tuzib bo‘lmaydi. Shuning uchun ham frontend sohasini o‘rganish aynan shu texnologiyalardan boshlanadi. Bularda bor imkoniyatlarga qo‘shimchalar va yangiliklar qo‘shilib, HTML5 va CSS3 standardlari ishlab chiqilgan.",
    subject_type: "topic",
  });

  useEffect(() => {
    addCourseList(param.id);
    addCourseListText(subject);
  }, []);
  const addCourseList = (id) => {
    setTimeout(() => {
      setAddCours(true);
    }, 1000);
  };
  const addCourseListText = (subject) => {
    setAddCourseText(
      `Siz xaqiqatdan ham ${subject.name} kursiga qo'shmoqchimisiz?`,
    );
  };
  const setAddCoursList = (type) => {
    setConfirmLoading(true);
    api.post(`api/nurse/course/add`,{course_id:location.state.message,next:type}).then((res) => {
      if (res.data.success) {
        Notification("Kurs qo'shildi");
      }
    }).finally(()=>{
      setConfirmLoading(false);
      setAddCours(false);
    }
    );



  };

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: "2rem" }}
        items={[
          {
            title: (
              <Link to="/">
                <BiHome />
              </Link>
            ),
          },
          {
            title: <Link to="/nurse/course/101">Предмет</Link>,
          },
        ]}
      />
      <Row gutter={16}>
        <Col span={24}>
          <Card title={subject.name}>{subject.content}</Card>
          <Button onClick={()=>setAddCoursList(false)}>Kursni qo`shish</Button>
          <Button onClick={()=>setAddCoursList(true)}>Kursni qo`shish va Davom etish</Button>
        </Col>
      </Row>
      <Modal title="Добавить курс" open={addCours} onOk={()=>setAddCoursList(false)} confirmLoading={confirmLoading} >
        {addCourseText}
      </Modal>
    </>
  );
};
export default SubjectItemPage;
