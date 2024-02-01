import { React, useEffect, useState } from "react";
import { api } from "../../../utils/api";
import { Card, Col, Row, List, Modal } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.scss";

function Statistics() {
	const [category, setCategory] = useState([]);
	const [course, setCourse] = useState([]);
	const [theme, setTheme] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isNumberNourse, setIsNumberNourse] = useState({});
	const [isNourseList, setIsNourseList] = useState([]);
	const [courseInfo, setCourseInfo] = useState([]);

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleOk = () => {
		setIsModalOpen(false);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
	};

	useEffect(() => {
		api.get(`api/admin/category/list`).then((res) => {
			setCategory(res.data.data);
		});
	}, []);

	const getCourse = (id) => {
		api.get(`api/admin/statistic/course/list/${id}`).then((res) => {
			setCourse(res.data.data);
		});
	};

	const getTheme = (id) => {
		api.get(`api/admin/statistic/subject/list/${id}`).then((res) => {
			setTheme(res.data.data);
		});
	};

	const getNurseData = (id) => {
		api.get(`api/admin/statistic/nurse/count/subject/end/${id}`).then(
			(res) => {
				setIsNumberNourse(res.data);
				console.log(res, "nurse number");
			},
		);

		api.get("api/admin/nurse/list").then((res) => {
			setIsNourseList(res.data.data);
			// console.log(res.data.data, "nurse list");
		});

		showModal();
	};

	const getCourseInfo = (id) => {
		api.get(`api/admin/nurse/course/list${id}`) //KURSLAR  listi
			.then((res) => {
				// setCourseInfo(res.data);
				console.log(res);
			});
	};

	console.log(isNumberNourse, "state");

	return (
		<>
			<Row className='list__'>
				<Col span={8}>
					<p className='desc'>Turkum nomi</p>
					<Card
						className='card name__card'
						style={{
							height: 450,
							overflow: "auto",
							padding: "0 16px",
							border: "1px solid rgba(140, 140, 140, 0.35)",
						}}
					>
						<InfiniteScroll
							dataLength={category.length}
							hasMore={category.length < 50}
							scrollableTarget='scrollableDiv'
						>
							<List
								className='name__list'
								bordered
								dataSource={category.map((el) => (
									<p onClick={() => getCourse(el.id)}>
										{el.name}
									</p>
								))}
								renderItem={(item) => (
									<List.Item className='list__item'>
										{item}
									</List.Item>
								)}
							/>
						</InfiniteScroll>
					</Card>
				</Col>

				<Col span={8}>
					<p className='desc'>Kurslar</p>
					<Card
						className='card '
						style={{
							height: 450,
							overflow: "auto",
							padding: "0 16px",
							border: "1px solid rgba(140, 140, 140, 0.35)",
						}}
					>
						<InfiniteScroll
							dataLength={category.length}
							hasMore={category.length < 50}
							scrollableTarget='scrollableDiv'
						>
							<List
								bordered
								dataSource={course.map((el) => (
									<p
										onClick={() => {
											getTheme(el.id);
										}}
									>
										{el.name}
									</p>
								))}
								renderItem={(item) => (
									<List.Item className='list__item'>
										{item}
									</List.Item>
								)}
							/>
						</InfiniteScroll>
					</Card>
				</Col>

				<Col span={8}>
					<p className='desc'>Mavzu</p>
					<Card
						className='card'
						style={{
							height: 450,
							overflow: "auto",
							padding: "0 16px",
							border: "1px solid rgba(140, 140, 140, 0.35)",
						}}
					>
						<InfiniteScroll
							dataLength={category.length}
							hasMore={category.length < 50}
							scrollableTarget='scrollableDiv'
						>
							<List
								bordered
								dataSource={theme.map((el) => (
									<p onClick={() => getNurseData(el.id)}>
										{el.name}
									</p>
								))}
								renderItem={(item) => (
									<List.Item className='list__item'>
										{item}
									</List.Item>
								)}
							/>
						</InfiniteScroll>
					</Card>
				</Col>
			</Row>

			<Modal
				className='modal__'
				open={isModalOpen}
				onCancel={handleCancel}
				footer={null}
				width={700}
				height={300}
			>
				<Row>
					<Col span={10}>
						<Card>
							<h2 className='headding__'>Hmashiralar soni</h2>
							<span className='line'></span>
							<List
								className='noutrses__list'
								bordered
								dataSource={isNourseList.map((el) => {
									return (
										<p
											onClick={() => {
												getCourseInfo(el.id);
												console.log("sacs");
											}}
											className='list__item_'
										>
											<span className='nurse__id'>
												{el.id}
											</span>
											<p>{el.last_name}</p>
										</p>
									);
								})}
								renderItem={(item) => (
									<List.Item className='list__item_'>
										{item}
									</List.Item>
								)}
							/>
						</Card>
					</Col>

					<Col span={6}>
						<Card>74</Card>
					</Col>

					<Col span={6}>
						<Card>74</Card>
					</Col>
				</Row>
			</Modal>
		</>
	);
}

export default Statistics;
