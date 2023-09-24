import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic,Form,Input,Button,Progress, Space } from 'antd';
import { api } from './../../../utils/api';
import { useForm } from 'antd/es/form/Form';
import {FaUsers} from 'react-icons/fa'
import { t } from "i18next";

const  StatisticList = () => {
    const [courseId,setCourseId]=useState(' ')
    const [testId,setTestId]=useState(' ')
    const [course,setCourse]=useState()
    const [test,setTest]=useState()
    const [form]=useForm()
    useEffect(()=>{
        api.post('api/admin/statistic/nurse/count')
        api.get(`api/admin/statistic/nurse/count/course/end/${courseId}`).then(res=>{
         setCourse(
            res.data.data.map(item=>{
                return{...item}
               })
         )})
        api.get(`api/admin/statistic/nurse/test/condition/${testId}`).then(res=>{
            console.log(res)
         setTest(res.data.data.map(item=>{
            return{...item}
         }))
        })
    })
    const grafic=(values)=>{
        setCourseId(values.course_id)
        setTestId(values.testSub)
    }
  return(
    <>
        <Form
    autoComplete="false"
    onFinish={grafic}
    layout="vertical"
    form={form}
    id="adminMonthListadd"
  >
     <Row gutter={[10, 10]} className="d-flex align-end">
      <Col xl={4} lg={4} md={24} sm={24} xs={24}>
        <Form.Item
          name="course_id"
          label="Course raqamini tanlang"
          rules={[{ required: true,message:"Course raqamini tanlang" }]}
        >
          <Input  />
        </Form.Item>
      </Col>
      <Col xl={4} lg={4} md={24} sm={24} xs={24}>
        <Form.Item
          name="testSub"
          label="Test raqamini tanlang"
          rules={[{ required: true,message:'Test raqamini tanlang'  }]}
        >
         <Input/>
        </Form.Item>
      </Col>
      <Col xl={3} lg={3} md={24} sm={24} xs={24}>
      <Button htmlType="submit" className="teacher_btn " type="primary">
    Ko'rish
  </Button>
      </Col>
    </Row>
  </Form>
  <div className='d-flex justify-center' >
  <Row gutter={16} style={{marginTop:"50px"}}>
    <Col span={10}>
    <Card title="Hamshiralar" style={{textAlign:'center',width:500}} bordered={false} >
        <Statistic
          value={course}
          contentFontSize
          valueStyle={{
            color:'#3f8600',
            fontSize:'50px'
          }}
          prefix={<FaUsers fontSize={100} />}
        />
      </Card>
    </Col>
    <Col span={2}/>
    <Col span={10}>
      <Card title="Test natijalari" style={{textAlign:'center',width:500}} bordered={false} width={300}>
          <Space wrap>
          <Progress type='dashboard' percent={test} />
        </Space>
      </Card>
    </Col>
  </Row>
 </div>
    </>

  )} ;  
export default StatisticList;