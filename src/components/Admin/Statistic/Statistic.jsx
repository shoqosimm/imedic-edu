import React, {useEffect, useState} from 'react';
import {
    Card,
    Col,
    Row,
    Statistic,
    Input,
    Progress,
    Space,
  Divider,
  Typography,
  Form,
  Select 
} from 'antd';
import {api} from './../../../utils/api';
import './mian.css'
import { Avatar } from 'antd';
import {FaUserNurse,FaUserClock} from 'react-icons/fa'
import {FaUsers} from 'react-icons/fa'
import {GiTeacher} from 'react-icons/gi'
import {GrTestDesktop} from 'react-icons/gr'
import {AiOutlineDislike, AiOutlineLike} from 'react-icons/ai'
import { useForm } from 'antd/es/form/Form';
 const StatisticList = () => {
    const [courseId,setCourseId] = useState('1')
    const [testId,setTestId] = useState('1')
    const [course, setCourse] = useState()
    const [category,setCategory] = useState()
    const [form]=useForm()
    const Text=Typography
    useEffect(() => {
        api.get(`api/admin/category/list`).then((res)=>{
            console.log(res)
            if(res.status==200)
            {
                setCategory(
                    res.data.data.map((item)=>{
                        return{
                            value:item.id,
                            label:item.name
                        }
                    })
                )
            }
        })      
    },[])
    let day=new Date()
   let kun=day.getDate()
   const courseChange= (value)=>{

   }
    return (
       <> 
<Form
        autoComplete="false"
        layout="vertical"
        form={form}
        id="statictik"
      >
        <Row gutter={[20, 20]} className="d-flex align-end">
          <Col xl={7} lg={7} md={24} sm={24} xs={24}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, whitespace: true }]}
            >
              <Select options={category} />
            </Form.Item>
          </Col>
          <Col xl={7} lg={7} md={24} sm={24} xs={24}>
            <Form.Item
              name="Course"
              label="Course"
              rules={[{ required: true }]}
            >
             <Select options={[
              {
                value:'1',
                label:'1-course'
              },  
              {
                value:'2',
                label:'2-course'
              },  {
                value:'3',
                label:'3-course'
              },  
              {
                value:'4',
                label:'4-course'
              },  
              {
                value:'5',
                label:'5-course'
              },  {
                value:'6',
                label:'6-course'
              },

              ]} onChange={courseChange} />
            </Form.Item>
          </Col>
          <Col xl={7} lg={7} md={24} sm={24} xs={24}>
          <Form.Item
              name="theme"
              label="Mavzu"
              rules={[{ required: true, whitespace: true }]}
            >
              <Select options={[{
                value:'mavzu',
                label:'Mavzu' },
                {
                value:'test',
                label:'Test'
                }
                ]} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

   <div className = 'container-star' > <Row gutter={24}>
   
        <Col span={12}>
            <div>
                <Row gutter={10}>
                    <Col span={6}>
                        <Card
                          title="General Statistics"
                            style={{
                            width: 500,
                            height: 408
                        }}
                            bordered={false}>
                               <div className='d-flex align-center'>
                                <Avatar icon={<FaUsers/>} size={80}
                                 style={{backgroundColor:'#666CFF', marginRight:'10px'}} />
                                 <Statistic
                                title="All Nurse"
                                value={4065}
                                valueStyle={{
                                color: '#72E128',
                                fontSize:'2rem',
                                marginRight:'45px'
                            }}
                                suffix={<FaUserNurse/>} />
                                <Input style={{width:100,border:'none',}} placeholder='Course id ' onChange={(e)=>setCourseId(e.target.value)}/>
                                <Input style={{width:100,border:'none',marginLeft:'5px'}} placeholder='Test id ' onChange={(e)=>setTestId(e.target.value)}/>
                               </div>
                               <Divider/>
                               <div className='d-flex align-center' >
                               <Avatar icon={<GiTeacher/>} size={50} style={{backgroundColor:'#72E128',marginRight:'20px'}} />
                               <Text style={{fontSize:'1.5rem'}}>course students </Text>
                               <Text  code style={{backgroundColor:'#666CFF',
                               fontSize:'1.2rem',color:'#fff',
                               borderRadius:"15px",padding:'0px 10px',marginLeft:'20px'}} >{course}</Text>
                               </div>
                               <Divider/>
                               <h2 style={{color:'#666CFF'}}>Course Activity</h2>
                                <Progress percent={(Math.round(kun*3.3))} />
                        </Card>
                    </Col>
                </Row>
            </div>
        </Col>
        <Col span={12}>
            <div >
                <Row gutter={[16,16]}>
                    <Col span={12}>
                        <Card
                            bordered={false}
                            style={{
                            width: 250,
                            height:200
                        }}>
                        <div className='d-flex align-center'>
                          <Avatar icon={<AiOutlineLike/>} size={50} style={{backgroundColor:'#72E128'}} />
                          <Statistic
                                title="done"
                                value={10}
                                valueStyle={{
                                color: '#72E128',
                                fontSize:'1.5rem',margin:'-10px 10px 0'
                            }}
                             suffix={<FaUserNurse/>}  />
                        </div>
                            <Space wrap style={{marginLeft:'80px'}}>
                              <Progress  type='circle' strokeColor={'#72E128'} percent={60}/>
                            </Space>
                        </Card>
                    </Col>
                    <Col span={12}>
                    <Card
                            bordered={false}
                            style={{
                            width: 250,
                            height:200
                        }}>
                        <div className='d-flex align-center'>
                          <Avatar icon={<AiOutlineDislike/>} size={50} style={{backgroundColor:'#FF4D49'}} />
                          <Statistic
                                title="fall"
                                value={10}
                                valueStyle={{
                                color: '#FF4D49',
                                fontSize:'1.5rem',margin:'-10px 10px 0'
                            }}
                             suffix={<FaUserNurse/>}  />
                        </div>
                            <Space wrap style={{marginLeft:'80px'}}>
                              <Progress  type='circle' strokeColor={'#FF4D49'} percent={60}/>
                            </Space>
                        </Card>
                    </Col>
                    <Col span={12}>
                    <Card
                            bordered={false}
                            style={{
                            width: 250,
                            height:200
                        }}>
                        <div className='d-flex align-center'>
                          <Avatar icon={<GrTestDesktop/>} size={50} style={{backgroundColor:'#FDB528'}} />
                          <Statistic
                                title="doing"
                                value={10}
                                valueStyle={{
                                color: '#FDB528',
                                fontSize:'1.5rem',margin:'-10px 10px 0'
                            }}
                             suffix={<FaUserNurse/>}  />
                        </div>
                            <Space wrap style={{marginLeft:'80px'}}>
                              <Progress  type='circle' strokeColor={'#FDB528'} percent={60}/>
                            </Space>
                        </Card>
                    </Col>
                    <Col span={12}>
                    <Card
                            bordered={false}
                            style={{
                            width: 250,
                            height:200
                        }}>
                        <div className='d-flex align-center'>
                          <Avatar icon={<FaUserClock/>} size={50} style={{backgroundColor:'#666CFF'}} />
                          <Statistic
                                title="doing"
                                value={10}
                                valueStyle={{
                                color: '#666CFF',
                                fontSize:'1.5rem',margin:'-10px 10px 0'
                            }}
                             suffix={<FaUserNurse/>}  />
                        </div>
                            <Space wrap style={{marginLeft:'80px'}}>
                              <Progress  type='circle' strokeColor={'#666CFF'} percent={60}/>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Col>
    </Row> </div>
  
    </>)
};
export default StatisticList;