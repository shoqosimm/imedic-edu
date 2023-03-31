import { Breadcrumb, Button, Card, Col, Row } from "antd";
import React, { useEffect,useState } from "react";
import { BiHome } from "react-icons/bi";
import "./style.scss";

import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../../../utils/api";

const SubjectPage = () => {
  const  param  = useParams();
  const navigate  = useNavigate();
  const [subjects, setSubjects] = useState([]);
  useEffect(() => {
    getSubjects(param.id);
  }, [param])
  const getSubjects = (id) => {
    api
      .get(`api/nurse/course/list/${id}`)
      .then((res) => {
        setSubjects(
          res.data.data.map((item)=>{
            return {
              id:item.id,
              name:item.name,
              teaser:item.teaser,
              subject_type:item.subject_type,

            }
          })
        )
        console.log(subjects);
      }
      )
      .catch((err) => {
        console.log(err);
      }
      );
  }


  

  const breadcrumbsItems = [
    {
      title: (
        <Link to="/">
          <BiHome />
        </Link>
      ),
    },
  ];
  const linkToSubject = (id) => {
    navigate(`/nurse/course/subject/${id}`, { state: { message: param.id } })
  }

  return (
    <>
      <Breadcrumb style={{ marginBottom: "2rem" }} items={breadcrumbsItems} />
        <Row gutter={16}>

        
          
            
                {subjects.map((item,index) => {
                  return (
                    <Col span={8} key={index}>
                      <Card
                      extra={
                        <Button type="primary" size="small" onClick={()=>linkToSubject(item.id)}>Boshlash</Button>
                        
                      }
                      title={item.name}
                      hoverable={index===0?true:false}
                    >
                      {item.teaser}
                      {item.subject_type}
                    </Card>
                    </Col>
                    
                  );
                }
                )}
               
              
             
          </Row>
    </>
  );
};
export default SubjectPage;
