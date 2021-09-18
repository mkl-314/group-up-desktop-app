import { Col, Modal, Row, Table } from "antd";
import * as React from "react";
import { studentDataColumns } from "../types/studentColumns";
import "./Modals.scss";
import imgExcel from "../assets/excel-format.jpg";

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
        <h2>Student Data File</h2>
        <div className="text-container">
          <p>
            The uploaded excel file requires to be formatted so that the program can obtain the
            correct data. Each column must have a header to determine the purpose of the column.
            There are four column types that need to be filled in, please see below for details:
          </p>
          <ul>
            <li>
              <b>First Name:</b> Input the person's first name.
            </li>
            <li>
              <b>Last Name:</b> Input the person's last name.
            </li>
            <li>
              <b>Choice:</b> Input the first name of the person's preference to be in a group. If
              two people have the same first name, please input either their first name and initial
              of their last name or the person's full name.
            </li>
            <li>
              <b>Exclude:</b> Input the first name of the person who cannot be in the same group. If
              two people have the same first name, please input either their first name and initial
              of their last name or the person's full name.
            </li>
          </ul>
          <p>
            Multiple "Choice" and "Exclude" columns are allowed and can be numbered. For example,
            "Choice 1", "Choice two", "Exclude one" or "Exclude 2"
          </p>
          <figure>
            <figcaption>Fig 1. Example of a possible excel file format</figcaption>
            <img src={imgExcel} alt="Format image"></img>
          </figure>
        </div>
      </Modal>
      <Modal
        title="Student Data"
        visible={studentDataVisible}
        footer={null}
        onCancel={() => setStudentDataVisible(false)}
        width="fit-content"
      >
        <Table
          dataSource={studentFileData}
          columns={studentDataColumns}
          rowKey={(record: any) => record.firstName + record.lastName}
          pagination={false}
        />
      </Modal>
    </>
  );
};
