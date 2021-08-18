import { Component, FC, useState } from "react";
import * as React from "react";
import "antd/dist/antd.css";
import { Table, Button, Popconfirm, Row, Col, Upload, message } from "antd";
import { BugTwoTone, FileProtectOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import { ExcelRenderer } from "react-excel-renderer";
import { read, WorkBook, utils, readFile } from "xlsx";
//import { EditableFormRow, EditableCell } from "../utils/editable";
import {
  GetGroups,
  InsertStudentChoices,
  InsertStudentExclusions,
  InsertStudents,
} from "../apiController";
import {
  StudentChoiceData,
  StudentData,
  StudentExcludeData,
  StudentFileData,
} from "../types/Student";
import { GroupData, groupColumns } from "../types/Groups";
import { columns, studentColumns } from "../types/studentColumns";

const Import: FC = () => {
  const [groupSize, setGroupSize] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [studentFileData, setStudentFileData] = useState<StudentFileData[]>();
  const [studentData, setStudentData] = useState<StudentData[]>();
  const [studentChoices, setStudentChoices] = useState<StudentChoiceData[]>();
  const [studentExcludes, setStudentExcludes] = useState<StudentExcludeData[]>();
  const [groups, setGroups] = useState<[GroupData]>();
  const [studentJSONData, setStudentJSONData] = useState<JSON[]>();

  const handleErrorMessage = (e: string) => {
    message.error({
      content: e,
      duration: 30,
      onClick: () => {
        message.destroy();
      },
    });
  };

  const handleLoadingMessage = (e: string) => {
    message.loading("Action in progress");
  };

  const fileHandler = async (e: File) => {
    try {
      if (isValidFile(e)) {
        console.log("test");
        var reader = new FileReader();
        reader.onload = function (fileObj) {
          const arrayBuffer: ArrayBuffer = fileObj.target.result as ArrayBuffer;
          var data = new Uint8Array(arrayBuffer);
          var wb = read(data, { type: "array", WTF: true });
          var sheet = wb.SheetNames[0];
          var worksheet = wb.Sheets[sheet];

          var jsonData = utils.sheet_to_json<JSON>(worksheet);
          convertJsonToStudents(jsonData);
          setStudentJSONData(jsonData);
        };
        reader.readAsArrayBuffer(e);
      }
    } catch (err) {
      handleErrorMessage("Could not handle file: " + err.Message);
    }
  };

  const convertJsonToStudents = (jsonData: JSON[]) => {
    try {
      const studentFileData: StudentFileData[] = JSON.parse(JSON.stringify(jsonData));
      let students: StudentData[] = [];
      let choices: StudentChoiceData[] = [];
      let exclusions: StudentExcludeData[] = [];

      jsonData.map((d, i) => {
        let json = JSON.parse(JSON.stringify(d));
        var firstName: string = "";
        var lastName: string = "";

        for (const key in json) {
          var key1 = key.replace(" ", "");

          if (key1.match(/^firstname/i)) {
            firstName = json[key];
          } else if (key1.match(/^lastname/i)) {
            lastName = json[key];
          }
        }

        students.push({
          id: i,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
      });

      jsonData.map((d, i) => {
        let json = JSON.parse(JSON.stringify(d));

        for (const key in json) {
          var key1 = key.replace(" ", "");

          if (key1.match(/^choice/i)) {
            const studentId = getStudentId(json[key], students);
            if (studentId >= 0) {
              choices.push({
                chooserStudentId: i,
                chosenStudentId: studentId,
              });
            } else {
              handleErrorMessage(
                "In column: " +
                  key +
                  ", row: " +
                  (i + 2) +
                  ". " +
                  json[key] +
                  " is not recognised as a student."
              );
            }
          } else if (key1.match(/^exclude/i)) {
            const studentId = getStudentId(json[key], students);
            if (studentId >= 0) {
              exclusions.push({
                firstStudentId: i,
                secondStudentId: json[key],
              });
            } else {
              handleErrorMessage(
                "In column: " +
                  key +
                  ", row: " +
                  (i + 2) +
                  ", " +
                  json[key] +
                  " is not recognised as a student."
              );
            }
          }
        }
      });
      console.log(choices);
      console.log(exclusions);
      setStudentData(students);
      setStudentChoices(choices);
      setStudentExcludes(exclusions);
      setStudentFileData(studentFileData);
    } catch (err) {
      handleErrorMessage("Could not convert excel to table: " + err);
    }
  };

  function getStudentId(name: string, students: StudentData[]): number {
    let studentIndex = students.findIndex((student) => {
      switch (name.toLowerCase().trim()) {
        case student.firstName.toLowerCase():
        case (student.firstName + " " + student.lastName[0]).toLowerCase():
        case (student.firstName + " " + student.lastName).toLowerCase(): {
          return true;
        }
        default:
          return false;
      }
    });
    return studentIndex;
  }
  const isValidFile = (e: File) => {
    console.log("fileList", e);
    let fileObj = e;
    if (!fileObj) {
      handleErrorMessage("No file uploaded!");
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      handleErrorMessage("Unknown file format. Only Excel files are uploaded!");
      return false;
    }
    return true;
  };

  const generateGroups = async () => {
    try {
      const response = await InsertStudents(studentData);
      console.log(response);
      await InsertStudentChoices(studentChoices);
      await InsertStudentExclusions(studentExcludes);

      setGroupSize(4);
      console.log("get groups");
      const result = await GetGroups(groupSize);
      setGroups(result);
      console.log(result);
    } catch (err) {
      handleErrorMessage("Could not generate groups: " + err.Message);
    }
  };
  return (
    <>
      <h1>Import Excel File</h1>
      <hr />
      <h4>{errorMessage}</h4>
      <Upload
        name="file"
        beforeUpload={fileHandler}
        //onRemove={}
        multiple={false}
      >
        <Button type="primary">
          <UploadOutlined /> Click to Upload Excel File
        </Button>
      </Upload>
      <Button type="ghost" onClick={generateGroups}>
        <BugTwoTone /> Generate Groups
      </Button>
      <div className="form-container">
        <div className="event-col">
          <div className="event-row"></div>
        </div>
        <div>
          <Table
            dataSource={studentFileData}
            columns={columns}
            rowKey={(record) => record.FirstName + record.LastName}
          />
          <Table dataSource={studentData} columns={studentColumns} rowKey={(record) => record.id} />
          <h2>Groups</h2>
          <Table
            dataSource={groups}
            columns={groupColumns}
            rowKey={(record) => record.student_id}
          />
        </div>
      </div>
    </>
  );
};

export default Import;
