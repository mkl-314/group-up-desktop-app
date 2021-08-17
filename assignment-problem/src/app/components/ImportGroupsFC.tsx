import { Component, FC, useState } from "react";
import * as React from "react";
import 'antd/dist/antd.css';
import { Table, Button, Popconfirm, Row, Col, Upload} from "antd";
import { BugTwoTone, FileProtectOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
// import { ExcelRenderer } from "react-excel-renderer";
import {read, WorkBook, utils, readFile} from 'xlsx';
//import { EditableFormRow, EditableCell } from "../utils/editable";
import { GetGroups, InsertStudents } from "../apiController";
import { StudentData, StudentFileData } from "../types/Student";
import { GroupData } from "../types/Groups";

const columns = [
  {
    title: "First Name",
    dataIndex: "FirstName",
    key: "FirstName",
  },
  {
    title: "Last Name",
    dataIndex: "LastName",
    key: "LastName",
  },
  {
    title: "Choice 1",
    dataIndex: "Choice1",
    key: "Choice1",
  },
  {
    title: "Choice 2",
    dataIndex: "Choice2",
    key: "Choice2",
  },
  {
    title: "Choice 3",
    dataIndex: "Choice3",
    key: "Choice3",
  },
  {
    title: "Choice 4",
    dataIndex: "Choice4",
    key: "Choice4",
  },

]

const Import: FC = () => {
  const [groupSize, setGroupSize] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [studentFileData, setStudentFileData] = useState<[StudentFileData]>();
  const [groups, setGroups] = useState<[GroupData]>();

  const fileHandler = async (e: File) => {
    if (isValidFile(e)) {
      handleFile(e);

    }
  };

  function handleFile(e: any) {
    var reader = new FileReader();
      reader.onload = function(fileObj) {
          const arrayBuffer: ArrayBuffer = fileObj.target.result as ArrayBuffer;
          var data = new Uint8Array(arrayBuffer);
          var wb = read(data, {type: 'array', WTF: true});
          var sheet = wb.SheetNames[0];
          var worksheet = wb.Sheets[sheet];

          var jsonData = utils.sheet_to_json<JSON>(worksheet);
          const studentFileData: [StudentFileData] = JSON.parse(JSON.stringify(jsonData));
          // Use list of choices
          // jsonData.map((d, i) => {
          // })
          console.log(studentFileData);
          setStudentFileData(studentFileData);
      };
      const fileName = e.name;

      reader.readAsArrayBuffer(e);
      return;
  }
  const isValidFile = (e: File) => {
    console.log("fileList", e);
    let fileObj = e;
    if (!fileObj) {
      setErrorMessage("No file uploaded!");
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      setErrorMessage("Unknown file format. Only Excel files are uploaded!");
      return false;
    }
    return true;
  }

  const generateGroups = async () => {
    const result = await GetGroups(studentFileData, groupSize);
    setGroups(result);
  }
  return (
    <>
      <h1>Import Excel File</h1>
      <hr />
      <div>{errorMessage}</div>
      <Upload
            name="file"
            beforeUpload={fileHandler}
            //onRemove={}
            multiple={false}
          >
            <Button type="primary">
               <UploadOutlined/>  Click to Upload Excel File
            </Button>
          </Upload>
          <Button type="ghost" onClick={generateGroups}>
            <BugTwoTone />  Generate Groups
            </Button>
        <div className="form-container">
            <div className="event-col">
              <div className="event-row">
              </div>
              </div>
              <div>
                <Table 
                  dataSource={studentFileData} 
                  columns={columns} 
                  rowKey={record => record.FirstName + record.LastName} 
                />
              {/* {studentFileData &&
                studentFileData.map((d, i) => (
                <div key={i}>
                    <h2>{"First Name : " + d.FirstName}</h2>
                    <h3>{"Last Name: " + d.LastName}</h3>
                    <hr />
                </div>
                ))} */}
                </div>
        </div>
    </>
  );
};

export default Import;

