import {useEffect} from "react"
import {api} from "../../../utils/api"
import {useState} from "react"
import {
    Modal,
    Card,
    Rate,
    Button,
    Drawer,
    Skeleton,
    notification
} from "antd"
import {t} from "i18next";
import './style.scss'
const NurseData = ({showModal, setShowModal, nurseId}) => {
    const [courseList,
        setCourseList] = useState([])
    const [subjectList,
        setSubjectList] = useState([])
    const [choose,
        setChoose] = useState(false)
    const [courseId,
        setCourseId] = useState(null)
    const [testId,
        setTestId] = useState(null)
    const [testList,setTestList] = useState([])
    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(true)
    const [cardLoading,setCardLoading]=useState(true)
    useEffect(() => {
        api
            .get(`api/admin/nurse/course/list/${nurseId}`)
            .then((res) => {
                setCourseList(res.data.data.map((item) => {
                    const course = item.course
                    setCardLoading(false)
                    return {id: course.id, name: course.name, rate: course.average_rate}
                }))
               
            })
    }, [nurseId])

    useEffect(() => {
        const body = {
            nurse_id: nurseId,
            course_id: courseId
        }
        api
            .get(`api/admin/nurse/subject/list`, {params: body})
            .then((res) => {
                setSubjectList(res.data.data.map((item) => {
                    const subject = item.subject
                    setLoading(false)
                    return {id: item.id, name: subject.name, type: subject.subject_type}
                }))
            })
    }, [nurseId, courseId])
    useEffect(() => {
        const body = {
            nurse_id: nurseId,
            test_subject_id: testId
        }
     
        api
            .get(`api/admin/nurse/test/log`, {params: body})
            .then((res) => {
                setTestList(res.data.data.map((item) => {
                    const test = item.test_to_test_log
                    return {id: item.ordering, question: test.question, answer: test.answer, right: item.is_right}
                }))
            })
    }, [nurseId, testId])
    const handleList = (value) => {
        setCourseId(value)
        setChoose(true)
    }
    const handelTest = (value) => {
        if (value[1] == 'test') {
            setOpen(true)
            setTestId(value[0])
        }
        else{
          notification.warning({
            message:t('topic'),
            icon:null
          })
        }
    }
    return (
        <div>
            <Modal
                centered
                open={showModal}
                title={t('nurseData')}
                onCancel={() => setShowModal(false)}
                width={800}
                footer>
                <div className="d-flex">
                    <Card
                        title={t('course')}
                        style={{
                        width: (choose
                            ? '50%'
                            : '100%')
                    }}>
                    <Skeleton loading={cardLoading}>
                    {courseList.map((item) => {

return (
    <Button
        ghost
        className="d-flex align-center gap-3 justify-between"
        style={{
        width: "100%",
        color: 'black'
    }}
        onClick={() => handleList(item.id)}>
        <span className="course-btn">
            <span>{item.id}</span>
            <span>{item.name}</span>
        </span>
        <Rate value={item.rate}/>
    </Button>
)
})}
                    </Skeleton>
                       
                    </Card>
                    <Card
                        title={t('subject')}
                        style={{
                        width: (choose
                            ? '50%'
                            : '100%'),
                        display: (choose
                            ? 'block'
                            : "none"),
                        color: "white"
                    }}>
                        <Skeleton loading={loading}>
                            {subjectList.map((item) => {
                                return (
                                    <Button
                                        ghost
                                        className="d-flex align-center gap-3 justify-between"
                                        style={{
                                        width: "100%",
                                        color: 'black'
                                    }}
                                        onClick={() => handelTest([item.id, item.type])}>
                                        <span className="course-btn">
                                            <span>{item.id}</span>
                                            <span>{item.name}</span>
                                        </span>
                                        <span>{item.type}</span>
                                    </Button>
                                )
                            })}
                        </Skeleton>
                    </Card>
                </div>
            </Modal>
            <Drawer
                title={t('testResult')}
                width={600}
                className="drawerList"
                open={open}
                onClose={() => setOpen(false)}>
                {testList.map((item) => {
                    return (
                        <div
                            style={{
                            margin: 10,
                            backgroundColor: (item.right
                                ? 'green'
                                : 'red')
                        }}>
                            <span >{item.id}
                            </span>
                            <span>{item.question}</span>
                            {item
                                .answer
                                .map(item => {
                                    return (
                                        <h4>{item}</h4>
                                    )
                                })}
                        </div>
                    )
                })}
            </Drawer>
        </div>
    )
}
export default NurseData
