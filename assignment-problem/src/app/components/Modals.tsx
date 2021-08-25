import { Col, Modal, Row, Table } from "antd";
import * as React from "react";
import { studentDataColumns } from "../types/studentColumns";
import "./Modals.scss";
import imgExcel from "../../images/excel-format.jpg";

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
        <h2>Excel File Data Format</h2>
        <div className="text-container">
          <p>
            The uploaded excel file requires to be formatted in a certain way so that the program
            can obtain the correct data. Each column must have a header to determine the purpose of
            the column. There are four column types that need to be filled in, please see below for
            details:
          </p>
          <ul>
            <li>
              <b>First Name:</b> Input the person's first name
            </li>
            <li>
              <b>Last Name:</b> Input the person's last name
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
          <h2>Group Generation</h2>
          <p>
            In the case that the program was not able to generate any groups, please see below for
            possible issues and resolutions:
          </p>
          <ul>
            <li>
              No solution found. Each person must be in a group with at least one chosen person and
              must not be in a group with any of the excluded people. See the following for possible
              reasons of no solutions:
              <ul>
                <li> Group Size of 2. People will not always get their preference.</li>
              </ul>
            </li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
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
