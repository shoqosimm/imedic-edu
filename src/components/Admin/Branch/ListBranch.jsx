import { Button } from 'antd'
import './style.css'
import { useState } from 'react'
import AddBranch from './AddBranch';
const  ListBranch = ()=>{
    const [showModal, setShowModal] = useState(false);
    const handleAdd= ()=>{
        setShowModal(true);
    }
    return (
        <div className="branch">
            <Button onClick={handleAdd} className="add_btn" type="primary">
                Qo'shish
            </Button>
            {showModal && 
                <AddBranch
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            }
        </div>
    )
}
export default ListBranch