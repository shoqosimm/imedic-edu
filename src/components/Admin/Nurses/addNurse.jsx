 import { Button,Form ,Input} from "antd";
import Modal from "antd/es/modal/Modal";
import React from "react";
import { api } from "../../../utils/api";
import { DatePicker, Space } from 'antd';
// import { DatePickerProps } from 'antd';
 import Swal from "sweetalert2";
 
 const Addnurse =({addNurseModal,setAddNurseModal})=>{

   // const onChange: DatePickerProps['onChange'] = (date, dateString) => {
   //    console.log(date, dateString);
   //  };

    const handleCancel = ()=>{
        setAddNurseModal(false)
    }

    const saveInfo = ()=>{
            const body = {
               first_name:"Ism",
               last_name: "Familya",
               branch_id:Number("id"),
               patronymic: form.getFieldValue('patronymic'),
               series:'series',
               pasport_number: 'pasport_number',
               pinfl:'pinfl',
               phone: "phone_number",
               birth_date: "birth_date",
               password:"123456",
               password_confirmation:"123456"

            }
            
            api.post('api/user/register', body).then((res) => {
              console.log(res);
              if(res.status ===400){
               console.log('hi shoqosim');
              }
            });
    }

    // saveInfo()

    const [form] = Form.useForm();

    return(
        <Modal
          width={550}
          open={addNurseModal}
          onCancel={handleCancel}
          title='Nurse info'
          footer={null}
          >
        
          <Form
            form={form}
            onFinish={saveInfo} 
            labelCol={{span:6}}
          >
          < Form.Item
            name={'Ism'}
            label={'Ism'}
            autoComplete="of"
            rules={[{
               required:true,
               message:'please inter your name'
            },
            {whitespace:true},{min:3}
         ]}
         hasFeedback
          >

              <Input 
                 type="text" 
                 placeholder="Ismingizni kiriting " 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item
               name={'Familya'}
               label={'Familya:'}
               autoComplete="of"
               rules={[{
                  required:true,
                  message:'please inter your  last name'
               },
               {whitespace:true},{min:3}
            ]}
            hasFeedback
           >
              <Input 
                 type="text" 
                 placeholder="Familyangizni kiriting" 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item
               name={'id'}
               label={'ID'}
               autoComplete="of"
               rules={[{
                  required:true,
                  message:'please inter your ID'
               },
               {whitespace:true}
            ]}
            hasFeedback
           >
              <Input 
                 type="number" 
                 placeholder="ID kiriting  " 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item
              name={'patronymic'}
              label={'Otasining ismi:'}
              autoComplete="of"
              rules={[{
                 required:true,
                 message:'please inter your patronymic name '
              },
              {whitespace:true},{min:3}
           ]}
           hasFeedback
           >
              <Input 
                 type="text" 
                 placeholder="Otangizning ismi" 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item 
              name={'series'}
              label={'Pasport Seria:'}
              autoComplete="of"
              rules={[{
                 required:true,
                 message:'please inter your patronymic name'
              },
              {whitespace:true},{min:2}
           ]}
           hasFeedback
           >
              <Input 
                 type="text" 
                 placeholder="Passport seriyangizni kiriting " 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item
              name={'pasport_number'}
              label={'Pasport Raqam '}
              autoComplete="of"
              rules={[{
                 required:true,
                 message:'please inter your Pasport Number'
              },
              {whitespace:true},{min:2}
           ]}
           hasFeedback
           >
              <Input 
                 type="number" 
                 placeholder="Passport seriyasi raqamlarini kiriting " 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item
              name={'pinfl'}
              label={'Pinfl:'}
              autoComplete="of"
              rules={[{
                 required:true,
                 message:'please inter your Pinfl Number'
              },
              {whitespace:true},{min:14}
           ]}
           hasFeedback
           >
              <Input 
                 type="number" 
                 placeholder="Pinfl raqamingizni kiriting " 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item  
              name={'phone_number'}
              label={'Telefon Raqam:'}
              autoComplete="of"
              rules={[{
                 required:true,
                 message:'please inter your Phone Number'
              },
              {whitespace:true},{min:3}
           ]}
           hasFeedback
           >
              <Input 
                 type="text" 
                 placeholder="Telefon raqamingizni kiriting  " 
                 style={{ maxWidth: 350 }}/>
           </Form.Item>

           < Form.Item
               name={'birth_date'}
               label={"To'g'ilgan Sana:"}
               autoComplete="of"
               
            hasFeedback
            >
               <DatePicker format="YYYY/MM/DD" />
           </Form.Item>

           <Button
            htmlType="submit"
            onClick={saveInfo()}
           >
                Saqlash
           </Button>
             
          </Form>
        </Modal>
    )
}

export default Addnurse;