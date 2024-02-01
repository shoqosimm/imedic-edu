import { Button, Form, Input, Modal,Select } from "antd"
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";
import { useEffect } from "react";
import { read } from "xlsx";
import { api } from "../../../utils/api";
import './delete.scss'

const DeleteNurse = ({deleteModal,setDeleteModal,id})=>{

    //============== form validate ============

    const [formInput , setFormInput] = React.useState({
        password:"",
        confirmPassword:"",
        Select:"",
        successMsg:""
      })
    
      const [formError, setFormError] = React.useState({
        password:"",
        confirmPassword:"",
        Select:"",
      })
    
      const handleInput = (name,value)=>{
        setFormInput({
          ...formInput,
          [name]:value,
        })
      }
    
      const validateFormInput = (evt)=>{
         
        evt.preventDefault();
    
        const inputError = {
          password:"",
          confirmPassword:"",
          Select:"",
        }
    

        if(!formInput.password && !formInput.confirmPassword){ 
          
          setFormError({
            ...inputError,
            password:"Password should not be empty",
          })
          return;
        }
    
        if(formInput.password !== formInput.confirmPassword){
          setFormError({
            ...inputError,
            confirmPassword:"Password and confirm password should not be the same",
          })
          return 
        }
    
        if(!formInput.password ){
          setFormError({
            ...inputError,
            password:"Password should not be empty",
          })
          return 
        }

        if(formInput.password.length<6){
            setFormError({
              ...inputError,
              password:"Password must be at least 6 characters long"
            })
            return
          }
      
          setFormError(inputError);
          setFormInput((prevState)=>({
            ...prevState,
            successMsg:"Validation success"
          }))
      }

    const [form] = Form.useForm();
    const [listBranch , setListBranch] = useState([])
     
    const savePassword = ()=>{

        const body = {
            password:form.getFieldValue('password'),
            password_confirm: form.getFieldValue('password_con')
        }

        api.post(`api/admin/teacher/update/user/password/${id}`,body).then((res)=>{
            console.log(res,'res data');
        })
    }

    useEffect(()=>{

        api.get('api/branch/list').then((res)=>{
          console.log (res)
            setListBranch(
                res.data.map((item)=>{
                    return {
                        value:item?.id,
                        label:item?.title
                    }
                })
            )
        })
    },[])


    const handleCancel = ()=>{
        setDeleteModal(false)
    }

    return (
        <>
            <Modal
                open={deleteModal}
                onCancel={handleCancel}
                footer={
                    <div >
                        <Button className="btn btn-success"   onClick={validateFormInput}  value="submit" >Save</Button>
                    </div>
                    
                }
                title={'Test deletes'}
            >
                <Form
                    form={form}
                    onFinish={savePassword}
                >
                    <Form.Item
                         label="Filialni tanlang">
                        <Select
                            options={listBranch}
                        />
                            
                            <p className='error__message'>{formError.Select}</p>   
                        
                    </Form.Item>
                    <Form.Item
                        name="password"
                    >
                        <Input
                           placeholder='Enter password'
                           style={{ maxWidth: 400 }}
                           type = 'password'
                           value={formInput.password}
                           onChange= {({target})=>{handleInput(target.name,target.value)}}
                           name= "password"
                           />
                           <p className='error__message'>{formError.password}</p>
                    </Form.Item>
                    <Form.Item
                        name="password_con"
                    >
                        <Input 
                          placeholder="Password confirm" 
                          style={{ maxWidth: 400 }}
                          type = 'confirmPassword'
                          value={formInput.confirmPassword}
                          onChange= {({target})=>{handleInput(target.name,target.value)}}
                          name= "confirmPassword"
                        />

              <p className='error__message'>{formError.confirmPassword}</p>
              <p className='success__message'>{formInput.successMsg}</p>
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
}
export default DeleteNurse;