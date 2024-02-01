import React, { useEffect, useState } from "react";
import {
	Card,
	Col,
	Row,
	Statistic,
	Form,
	Select,
	Spin,
	Divider,
	Result,
	Button,
	Pagination,
} from "antd";
import { api } from "./../../../utils/api";
import "./style.scss";
import { useForm } from "antd/es/form/Form";
import { FaUserNurse } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { CgSandClock } from "react-icons/cg";
import { FcOvertime } from "react-icons/fc";
import NurseData from "./nurseData";
import { t } from "i18next";

const StatisticList = () => {
	const [form] = useForm();
	const [loading, setLoading] = useState(true);
	const [category, setCategory] = useState([]);
	const [courseList, setCourseList] = useState([]);
	const [subject, setSubject] = useState([]);
	const [categoryId, setCategoryId] = useState("");
	const [courseId, setCourseId] = useState("");
	const [subjectId, setSubjectId] = useState("");
	const [nurses, setNurses] = useState(null);
	const [theme, setTheme] = useState(null);
	const [testId, setTestId] = useState("");
	const [listTest, setListTest] = useState([]);
	const [show, setShow] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [nurseId, setNurseId] = useState(null);
	const [nurseList, setNurseList] = useState([]);
	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 10,
		total: 100,
	});
	const { Meta } = Card;
	//Umumiy statistika

	useEffect(() => {
		api.get(`api/admin/statistic/subject/list/${courseId}`) //mavzular listi x
			.then((res) => {
				setSubject(
					res.data.data.map((item) => {
						return {
							value: item.id,
							label: item.name + " " + item.subject_type,
							type: item.subject_type,
						};
					}),
				);
			});

		api.get(`api/admin/statistic/nurse/count/course/end/${courseId}`) //KURSLAR  listi
			.then((res) => {
				setNurses(res.data);
			});
	}, [courseId]);

	useEffect(() => {
		api.post(`api/admin/statistic/nurse/count`); //backga post
		api.get(`api/admin/category/list`) //category list x
			.then((res) => {
				if (res.status == 200) {
					setCategory(
						res.data.data.map((item) => {
							return { value: item.id, label: item.name };
						}),
					);
				}
			});
		api.get(`api/admin/statistic/course/list/${categoryId}`).then((res) => {
			setCourseList(
				res.data.data.map((item) => {
					return { value: item.id, label: item.name };
				}),
			);
		});
		getNurseList();
	}, [categoryId]);

	useEffect(() => {
		api.get(
			`api/admin/statistic/nurse/count/subject/end/${subjectId}`,
		).then((res) => {
			setTheme(res.data); //mavzdagi hamshiralar soni
		});
		api.get(`api/admin/statistic/nurse/test/condition/${testId}`).then(
			(res) => {
				setListTest(res.data);
			},
		); //test natijalari
	}, [subjectId, testId]);
	//hamshiralare ma'lumotrlari
	const getNurseList = async (page, pageSize) => {
		const body = {
			page: page,
			pageSize: pageSize,
		};
		const res = await api.get("api/admin/nurse/list", { params: body });
		try {
			if (res) {
				setNurseList(
					res.data.data.map((item) => {
						return {
							id: item.id,
							name: item.last_name + " " + item.first_name,
						};
					}),
				);
				setPagination({
					page: res.data.page,
					pageSize: res.data.per_page,
					total: res.data.total,
				});
			}
		} catch (err) {
			console.log(err, "err");
		}
	};
	const categoryChange = (value) => {
		setCategoryId(value);
	};
	const courseChange = (value) => {
		setCourseId(value);
	};
	const subjectChange = (value, type) => {
		if (type.type == "test") {
			setTestId(value);
			setShow(true);
		} else {
			setSubjectId(value);

			setShow(false);
		}
		setLoading(false);
	};
	const handleList = (value) => {
		setShowModal(true);
		setNurseId(value);
	};
	return (
		<>
			<div className='container-from'>
				<Form
					autoComplete='false'
					layout='vertical'
					form={form}
					id='statictik'
				>
					<Row gutter={[20, 20]} className='d-flex align-end'>
						<Col xl={7} lg={7} md={24} sm={24} xs={24}>
							<Form.Item
								name='category'
								label={t("categoryName")}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									options={category}
									onChange={categoryChange}
								/>
							</Form.Item>
						</Col>
						<Col xl={7} lg={7} md={24} sm={24} xs={24}>
							<Form.Item
								name='Course'
								label={t("course")}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									options={courseList}
									onChange={courseChange}
								/>
							</Form.Item>
						</Col>
						<Col xl={7} lg={7} md={24} sm={24} xs={24}>
							<Form.Item
								name='theme'
								label={t("cours")}
								rules={[
									{
										required: true,
									},
								]}
							>
								<Select
									options={subject}
									onChange={subjectChange}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</div>
			<div className='container-star'>
				{" "}
				<div>
					<Spin spinning={loading} size='large'>
						<Row gutter={[24, 24]}>
							<Col span={9}>
								<Card
									style={{
										width: "90%",
										height: 400,
									}}
								>
									<Meta
										avatar={<FaUserNurse size={50} />}
										title={`  ${t("allNurse")} ${nurses}`}
										style={{
											margin: "10px 10px 0px 10px",
											fontSize: "1rem",
											color: "#666CFF",
										}}
										className='align-center'
									/>
									<Divider />
									<Card
										style={{
											height: 250,
											overflow: "auto",
										}}
									>
										<ul style={{ listStyle: "none" }}>
											{nurseList.map((item) => {
												return (
													<li key={item.id}>
														<Button
															ghost
															onClick={() =>
																handleList(
																	item.id,
																)
															}
															className='d-flex gap-3'
															style={{
																color: "black",
															}}
														>
															<span>
																{item.id}
															</span>
															{item.name}
															<span></span>
														</Button>
													</li>
												);
											})}
										</ul>
										<Pagination
											current={pagination.page}
											pageSize={pagination.pageSize}
											total={pagination.total}
											size='small'
										/>
									</Card>
								</Card>
							</Col>
							<Col span={15}>
								<div
									style={{
										display: `${show ? "none" : "block"}`,
									}}
								>
									<Row gutter={[16, 16]}>
										<Col span={12}>
											<Card className='cardDesgin'>
												<Result
													icon={
														<FaUsers size={100} />
													}
													title={`${t(
														"courseNurse",
													)} ${nurses}`}
													style={{
														color: "#72E128",
													}}
												/>
											</Card>
										</Col>
										<Col span={12}>
											<Card className='cardDesgin'>
												<Result
													icon={
														<GiTeacher size={100} />
													}
													title={`${t(
														"courseNurse",
													)} ${theme}`}
													style={{
														color: "#26C6F9",
													}}
												/>
											</Card>
										</Col>
									</Row>
								</div>
								<div
									style={{
										display: `${show ? "block" : "none"}`,
									}}
								>
									<Row gutter={[16, 16]}>
										<Col span={12}>
											<Card className='testDesgin'>
												<Statistic
													title={t("testDone")}
													value={listTest.done}
													valueStyle={{
														color: "#72E128",
													}}
													prefix={
														<AiOutlineCheckCircle
															size={30}
														/>
													}
												/>
											</Card>
										</Col>
										<Col span={12}>
											<Card className='testDesgin'>
												<Statistic
													title={t("testFall")}
													value={listTest.fall}
													valueStyle={{
														color: "#FF4D49",
													}}
													prefix={
														<AiOutlineCloseCircle
															size={30}
														/>
													}
												/>
											</Card>
										</Col>
										<Col span={12}>
											<Card className='testDesgin'>
												<Statistic
													title={t("testDoing")}
													value={listTest.doing}
													valueStyle={{
														color: "#FDB528",
													}}
													prefix={
														<CgSandClock
															size={30}
														/>
													}
												/>
											</Card>
										</Col>
										<Col span={12}>
											<Card className='testDesgin'>
												<Statistic
													title={t("testNot")}
													value={listTest.no_done}
													valueStyle={{
														color: "#26C6F9",
													}}
													prefix={
														<FcOvertime size={30} />
													}
												/>
											</Card>
										</Col>
									</Row>
								</div>
							</Col>
						</Row>
					</Spin>
					{showModal && (
						<NurseData
							showModal={showModal}
							setShowModal={setShowModal}
							nurseId={nurseId}
						/>
					)}
				</div>
			</div>
		</>
	);
};
export default StatisticList;
