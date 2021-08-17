import { Component, FC, useState } from "react";
import * as React from "react";
import 'antd/dist/antd.css';
import { Table, Button, Popconfirm, Row, Col, Upload} from "antd";
import { BugTwoTone, FileProtectOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
// import { ExcelRenderer } from "react-excel-renderer";
import {read, WorkBook, utils, readFile} from 'xlsx';
//import { EditableFormRow, EditableCell } from "../utils/editable";
import { GetGroups, InsertStudents } from "../apiController";
import { StudentChoiceData, StudentData, StudentExcludeData, StudentFileData } from "../types/Student";
import { GroupData } from "../types/Groups";
import { columns, studentColumns } from "../types/studentColumns";

const Import: FC = () => {
  const [groupSize, setGroupSize] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [studentFileData, setStudentFileData] = useState<[StudentFileData]>();
  const [studentData, setStudentData] = useState<[StudentData]>();
  const [studentChoices, setStudentChoices] = useState<[StudentChoiceData]>();
  const [studentExcludes, setStudentExcludes] = useState<[StudentExcludeData]>();
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
          convertJsonToStudents(jsonData);
      };
      reader.readAsArrayBuffer(e);
  }

  const convertJsonToStudents = (jsonData: JSON[]) => {
    const studentFileData: [StudentFileData] = JSON.parse(JSON.stringify(jsonData));
    let students: [StudentData];
    let choices: [StudentChoiceData];
    let exclusions: [StudentExcludeData];
    
    jsonData.map((d, i) => {
      let json = JSON.parse(JSON.stringify(d));
      let student: StudentData = {
        key: i,
        firstName: json.firstName,
        lastName: json.lastName,
      }
      students.push(student);
      for (const key in json) {
        if (key.match(/^choice/i)) {
          choices.push({
            chooserStudent: json.firstName + ' ' + json.lastName,
            chosenStudent: json[key],
          })
        } else if (key.match(/^exclude/i)) {
          exclusions.push({
            firstStudent: json.firstName + ' ' + json.lastName,
            secondStudent: json[key],
          })
        }
      }

    })
    setStudentData(students);
    setStudentChoices(choices);
    setStudentExcludes(exclusions);
    setStudentFileData(studentFileData);
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
                  rowKey={record => record.firstName + record.lastName} 
                />
                <Table 
                  dataSource={studentData} 
                  columns={studentColumns} 
                  rowKey={record => record.id} 
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

