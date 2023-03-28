import { Row, Select } from "antd";
import React from "react";
import "./style.scss";

const NurseCourse = () => {
  return (
    
    <div>
      <Select className="select" />
      <Row className="nurseList">
        <h1>Nurse Course</h1>
        <ul>
          <li>1.birinchisi example</li>
          <li>1.birinchisi example</li>
          <li>1.birinchisi example</li>
          <li>1.birinchisi example</li>
          <li>1.birinchisi example</li>
        </ul>
      </Row>
    </div>
  );
};

export default NurseCourse;
