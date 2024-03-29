import { Button, Table } from 'antd'
import './style.css'
import { useState } from 'react'
import AddBranch from './AddBranch';
import { useEffect } from 'react';
import { api } from '../../../utils/api';
import { BiEditAlt } from 'react-icons/bi';
import {t} from 'i18next';
const  ListBranch = ()=>{
    const [showModal, setShowModal] = useState(false);
    const [itemRecord,setItemRecord] = useState([])
    const [dataSource,setDataSource] = useState([]);
    const [tableLoading, setTableLoading] = useState(true);
    const handleAdd= ()=>{
        setShowModal(true);
    }
    useEffect(() => {
        api.get('api/admin/branch/list')
        .then(res=>{
            if (res) {
                setDataSource(
                    res.data.data.map((item)=>{
                        return {
                            id:item.id,
                            title:item.title,
                            phone:item.phone,
                            director:item.director,
                            branch_name:item.branch_name
                        }
                    })
                )
                setTableLoading(false)
            }
        })
      }, []);
      const editBranch = (record) =>{
        setItemRecord(record)
        setShowModal(true)
      }
    const columns=[
        {
            title: "№",
            dataIndex: "id",
            key: "id",
        },
        {
            title:t('branchName'),
            dataIndex:"title",
            key:"title"
        },
        {
            title:t('phoneNumber'),
            dataIndex:"phone",
            key:"phone"
        },
        {
            title:<BiEditAlt/>,
            render:((record)=>{
                return <BiEditAlt onClick={()=>editBranch(record)} />
            })
        }
    ]
    return (
        <div className="branch">
            <Button onClick={handleAdd} className="add_btn" type="primary">
             {t('addition')}
            </Button>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={tableLoading}
                />
            {showModal && 
                <AddBranch
                    showModal={showModal}
                    setShowModal={setShowModal}
                    itemRecord={itemRecord}
                />
            }
        </div>
    )
}
export default ListBranch