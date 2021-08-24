import { Col, Modal, Row, Table } from "antd";
import * as React from "react";
import { studentDataColumns } from "../types/studentColumns";
import "./Modals.scss";
//const excelImage = require("../images/format.jpg");

export const Modals = ({
  instructVisible,
  setInstructVisible,
  studentDataVisible,
  setStudentDataVisible,
  studentFileData,
}: any) => {
  return (
    <>
      <Modal
        title="Instructions"
        visible={instructVisible}
        footer={null}
        onCancel={() => setInstructVisible(false)} // uses function for closable and mask closable
        width="fit-content"
      >
        <p>The uploaded excel file must have the following headers:</p>
        {/* <img src={excelImage} alt="Format image"></img> */}
        <Row gutter={24} wrap={false}>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">First Name</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">Last Name</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">Choice</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">...</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">Choice</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">Exclude</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">...</div>
          </Col>
          <Col className="gutter-row" span={3}>
            <div className="col-excel">Exclude</div>
          </Col>
        </Row>
        <p></p>
      </Modal>
      <Modal
        title="StudentData"
        visible={studentDataVisible}
        footer={null}
        onCancel={() => setStudentDataVisible(false)}
        width="fit-content"
      >
        <Table
          dataSource={studentFileData}
          columns={studentDataColumns}
          rowKey={(record) => record.firstName + record.lastName}
          pagination={false}
        />
      </Modal>
    </>
  );
};
