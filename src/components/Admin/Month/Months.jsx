import { Button, Form, Input, Modal, Table,DatePicker, Select,Col,Row } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../../utils/api";
import { t } from "i18next";
const Months = () => {
    const [form] = Form.useForm();
    const [month,setMonth] = useState([])
    const [searchText,setSearchText] = useState('')
    const [tableLoading, setTableLoading] = useState(false);
    const [value, setValue] = useState([]);
    const [branch,setBranch]=useState([])
    const [pagination,setPagination] = useState({
        page:1,
        pageSize:10,
        total:100
    })
 

    useEffect(()=>{
        api.get('api/branch/list').then((res)=>{
            if (res.status==200) {
                setBranch(
                    res.data.map((item)=>{
                       return{
                        value:item?.id,
                        label:item?.title,
                       }
                    })
                )}
        }).catch((error)=>{
            console.log(error);
        })
        getMonthList()
    },[searchText])
    const getMonthList = async (page, pageSize) => {
        setTableLoading(true);
        const body = {
            page: page,
            pageSize: pageSize,
            search:searchText
        };
        const res = await api.get("api/admin/month/list", { params: body });
        try {
          if (res) {
            setTableLoading(false);
            setMonth(
              res.data.data.map((item) => {
                return {
                    ...item
                };
              })
            );
            setPagination({
                page: res.data.page,
              pageSize: res.data.per_page,
              total: res.data.total,
            });
          }
        } catch (err) {
          console.log(err, "err");
          setTableLoading(false);
        } finally {
          setTableLoading(false);
        }
      };
    console.log(searchText)
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'name',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'oy',
            dataIndex: 'month',
            key: 'month',
        },
        {
            title: 'year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'holati',
            dataIndex: 'is_active',
            key: 'is_active',
        },
        {
            title: 'branch_id',
            dataIndex: 'branch_id',
            key: 'branch_id',
        },
    ];
    const search = (e) => {
        const   value = e.target.value
        if (value.length > 3) {
            setSearchText(e.target.value)
        }
    }
    //add Months
const handleAdd = async(values)=>{
    console.log(values)
const data=values
       setValue(
        {...data,
        id:data.month.$M+1,
        branch_id:data.branch_id,
        title:data.title,
        year:data.month.$y,
        month:data.month.$M+1
        })
        const body={
          data:{...value}
        }
 console.log(body)
        const res = await api.post("api/admin/month/add", body);
        try {
          if (res) {
            toast.success("Yaratildi!");
          }
          toast.error("Ma'lumotlar noto'g'ri ko'rsatildi");
        } catch (err) {
          console.log(err, "err");
          setLoading(false);
        } 
}
  console.log(value)
    return (
        <div>
            <Form
        autoComplete="false"
        onFinish={handleAdd}
        layout="vertical"
        form={form}
        id="adminMonthListadd"
      >
         <Row gutter={[20, 20]} className="d-flex align-end">
          <Col xl={9} lg={9} md={24} sm={24} xs={24}>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, }]}
            >
              <Input  />
            </Form.Item>
          </Col>
          <Col xl={4} lg={4} md={24} sm={24} xs={24}>
            <Form.Item
              name="month"
              label="Oy ni tanlang"
              rules={[{ required: true }]}
            >
               <DatePicker size="large" style={{width:190}}  picker="month" />
            </Form.Item>
          </Col>
          <Col  xl={4} lg={4} md={24} sm={24} xs={24}>
            <Form.Item name='branch_id' label='branchni tanlang' >
            <Select size="large" options={branch}/>
            </Form.Item>
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
          <Button htmlType="submit" className="teacher_btn " type="primary">
        Qo'shish
      </Button>
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
          <Button  className="teacher_btn " type="primary">
        Bekor qilish
      </Button>
      </Col>
        </Row>
      </Form>

            <Input placeholder="Qidiruv" onChange={search} />
            <Table
                loading={tableLoading}
                columns={columns}
                dataSource={month}
                pagination={{
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) => {
                      getMonthList(page, pageSize);
                    },
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                  }}
            />
        </div>
    )}
    export default Months;