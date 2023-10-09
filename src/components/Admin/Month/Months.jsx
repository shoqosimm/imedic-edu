import { Button, Form, Input, Modal, Table,DatePicker, Select,Col,Row } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../../../utils/api";
import{BiCheckCircle} from 'react-icons/bi'
import{AiOutlineCloseCircle} from 'react-icons/ai'
import { t } from "i18next";
const Months = () => {
    const [form] = Form.useForm();
    const [month,setMonth] = useState([])
    const [monthNumber,setMonthNumber] = useState([
        {value:1,label:t('january')},
        {value:2,label:t('february')},
        {value:3,label:t('march')},
        {value:4,label:t('april')},
        {value:5,label:t('may')},
        {value:6,label:t('june')},
        {value:7,label:t('july')},
        {value:8,label:t('august')},
        {value:9,label:t('september')},
        {value:10,label:t('october')},
        {value:11,label:t('november')},
        {value:12,label:t('december')},
    ])
    const [searchText,setSearchText] = useState('')
    const [tableLoading, setTableLoading] = useState(true);
    const [data, setData] = useState({});
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
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title:t('coment'),
            dataIndex: 'title',
            key: 'title',
        },
        {
            title:t('month'),
            dataIndex: 'month',
            key: 'month',
        },
        {
            title:t('year'),
            dataIndex: 'year',
            key: 'year',
        },
        {
          title: t("status"),
          dataIndex: "is_active",
          key: "is_active",
          align: "center",
          render: (text) => {
            return (
              (text === "1" && (
                <BiCheckCircle style={{ fill: "green", fontSize: "18px" }} />
              )) ||
              (text === "0" && (
                <AiOutlineCloseCircle style={{ fill: "red", fontSize: "18px" }} />
              ))
            );
          },
        },
        {
            title: t('branch_id'),
            dataIndex: 'branch_id',
            key: 'branch_id',
        },
    ];
    const search = (e) => {
        const   value = e.target.value
        if (value.length >3) {
            setSearchText(e.target.value)
        }
    }
    //add Months
const handleAdd = async(values)=>{
    monthNumber.map((item)=>{
      const bo = {
        title:item?.label,
        year:values?.month.$y,
        month:item?.value,

      }
      console.log(bo,"bo");
      setMonth({...month,bo} )
    })
    console.log(month,"month");
    
      //  setData(
      //   {...data,
      //   id:values.month.$M+1,
      //   branch_id:values.branch_id,
      //   title:values.title,
      //   year:String(values.month.$y),
      //   month:values.month.$M+1
      //   })
      //   const body={
      //     data:[{...data}]
      //   }
      //   console.log(body,":bodu");
        // const res = await api.post("api/admin/month/add", body);
        try {
          if (res) {
            toast.success(t('wasCreated'));
          }
          toast.error(t('dateError'));
        } catch (err) {
          console.log(err, "err");
          setLoading(false);
        } 
}
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
          <Col xl={6} lg={6} md={24} sm={24} xs={24}>
          <Form.Item
            label={t('month')}
            name="month"
            rules={[
              {
                required: true,
                message: t('pleaseInput'),
              },
            ]}
          >
            <DatePicker picker="year" />
          </Form.Item>
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
          <Button htmlType="submit" className="teacher_btn " type="primary">
        {t('addition')}
      </Button>
          </Col>
          <Col xl={3} lg={3} md={24} sm={24} xs={24}>
          <Button  className="teacher_btn " type="primary">
        {t('notSave')}
      </Button>
      </Col>
        </Row>
      </Form>

            <Input placeholder={t('search')}  onChange={search} />
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