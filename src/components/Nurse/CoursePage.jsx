import { Card, Row, Select,Col, Table } from "antd";
import Meta from "antd/es/card/Meta";
import React, { useState } from "react";
import { BiPencil } from "react-icons/bi";
import { Link } from "react-router-dom";

function CoursePage() {

    const [category, setCategory] = useState([
            {
                label:"Test 1",
                value:1
            },
            {
                label:"Test 2",
                value:2
            }
        ]);
        const [course,setCourse] = useState([]);
        const [loadingCard, setLoadingCard] = useState(true);
        const [ran,setRan] = useState([
            {id:101,count:10,is_active:1,teacher:"Kim Cha Xon",text:"Test text number 1"},
            {id:2,count:8,is_active:0,teacher:"Kim Mo Xon",text:"Test text number 2"},
            {id:2,count:8,is_active:0,teacher:"Kim Mo Xon",text:"Test text number 2"},
            
            ])
    const gridStyle = {
        width: '25%',
        textAlign: 'center',
      };
    const handleChange = (value) => {
        getCourse(value);
      };
      const handleCourse = (value) =>{
            console.log(value,"Tess");
      }
      function getCourse(id) {
        setCourse(
            ran.map((item,key)=>{
                return {
                    id:item.id,
                    key:key,
                    text:item.text,
                    teacher:item.teacher,
                    count_tema:item.count,
                    is_active:item.is_active
                };
            }),
            setLoadingCard(false)
        ); 
      }
      const style = {
        background: '#0092ff',
        padding: '8px 0',
      };
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Text',
                dataIndex: 'text',
                key: 'text',
            },
            {
                title: 'Teacher',
                dataIndex: 'teacher',
                key: 'teacher',
            },
            {
                title: 'Count tema',
                dataIndex: 'count_tema',
                key: 'count_tema',
            },
            {
                title: 'Is active',
                dataIndex: 'is_active',
                key: 'is_active',
            },
            {
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <Link to={`/nurse/course/${record.id}`}>
                        <BiPencil/>
                    </Link>
                ),
            },
        ];

    return (
        <>
            <Row gutter={24}>
                <Col span={24}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Yo`nalishni tanlang"
                        onChange={handleChange}
                        options={category}
                    />
                </Col>
                <Col span={24}>
                    <Table
                    loading={loadingCard}
                    columns={columns}
                    dataSource={course}

                    />
                </Col>
            </Row>
            
        </>
    )

}
export default CoursePage;