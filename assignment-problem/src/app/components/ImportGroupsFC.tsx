import { Component, FC, useState } from "react";
import * as React from "react";
import "antd/dist/antd.css";
import { Table, Button, Upload, Input } from "antd";
import { BugTwoTone, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import "./ImportGroups";
import { read, utils } from "xlsx";
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
import { GroupData1, groupColumns1 } from "../types/Groups";
import { columns, studentColumns } from "../types/studentColumns";
import {
  handleWarningMessage,
  handleErrorMessage,
  handleLoadingMessage,
  handleSuccessMessage,
} from "../utils/messages";

export const groupColumns2 = [
  {
    title: "Group Number",
    dataIndex: "groupNumber",
    key: "groupNumber",
  },
  {
    title: "Students",
    dataIndex: "studentNames",
    key: "studentNames",
    render: (text: string[], row: any, index: any) => {
      return <>{text && text.map((d: string, i: any) => <div>{d}</div>)}</>;
    },
  },
];

const Import: FC = () => {
  const [groupSize, setGroupSize] = useState<number>();
  const [studentFileData, setStudentFileData] = useState<StudentFileData[]>();
  const [studentData, setStudentData] = useState<StudentData[]>();
  const [studentChoices, setStudentChoices] = useState<StudentChoiceData[]>();
  const [studentExcludes, setStudentExcludes] = useState<StudentExcludeData[]>();
  const [groups, setGroups] = useState<GroupData1[]>();
  const [studentDisplay, setStudentDisplay] = useState<string>("block");

  const handleGroupSize = (e: any) => {
    if (!isNaN(+e.target.value)) {
      setGroupSize(e.target.value);
    } else {
      handleWarningMessage("Please input a number.");
    }
    console.log(groups);
  };

  function toggleStudentDisplay() {
    if (studentDisplay === "block") {
      setStudentDisplay("none");
    } else {
      setStudentDisplay("block");
    }
  }
  const fileHandler = async (e: File) => {
    try {
      if (isValidFile(e)) {
        var reader = new FileReader();
        reader.onload = function (fileObj) {
          const arrayBuffer: ArrayBuffer = fileObj.target.result as ArrayBuffer;
          var data = new Uint8Array(arrayBuffer);
          var wb = read(data, { type: "array", WTF: true });
          var sheet = wb.SheetNames[0];
          var worksheet = wb.Sheets[sheet];

          var jsonData = utils.sheet_to_json<JSON>(worksheet);
          convertJsonToStudents(jsonData);
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
                `In column: ${key}, row: ${i + 2}. ${json[key]} is not recognised as a student.`
              );
            }
          } else if (key1.match(/^exclude/i)) {
            const studentId = getStudentId(json[key], students);
            if (studentId >= 0) {
              exclusions.push({
                firstStudentId: i,
                secondStudentId: studentId,
              });
            } else {
              handleErrorMessage(
                `In column: ${key}, row: ${i + 2}. ${json[key]} is not recognised as a student.`
              );
            }
          }
        }
      });
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
    //console.log("fileList", e);
    let fileObj = e;
    if (!fileObj) {
      handleErrorMessage("No file uploaded!");
      return false;
    }
    //console.log("fileObj.type:", fileObj.type);
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
      if (isNaN(+groupSize)) {
        handleWarningMessage("Group size must be a number!");
      }
      handleLoadingMessage("Generating Groups", "group");
      await InsertStudents(studentData);
      await InsertStudentChoices(studentChoices);
      await InsertStudentExclusions(studentExcludes);

      await GetGroups(groupSize).then((result) => {
        if (result !== null) {
          setGroups(result);
        } else {
          handleErrorMessage("Could not generate groups", "group");
        }
      });
      handleSuccessMessage("Groups have been generated!", "group");
    } catch (err) {
      console.log(err);
      handleErrorMessage("Could not generate groups: " + err.message, "group");
    }
  };

  return (
    <>
      <body>
        <h1>Import Excel File</h1>
        <hr />
        <div className="container">
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
        </div>
        <div className="container">
          <Input
            style={{ width: 60 }}
            onChange={handleGroupSize}
            maxLength={3}
            placeholder="Input group size"
          ></Input>
          <Button type="ghost" onClick={generateGroups}>
            <BugTwoTone /> Generate Groups
          </Button>
        </div>
        <div className="container">
          <Button type="ghost" onClick={toggleStudentDisplay}>
            <BugTwoTone /> Show/hide student data
          </Button>
        </div>
        <div style={{ display: studentDisplay }} className="container">
          <Table
            title={() => "Student Data"}
            dataSource={studentFileData}
            columns={columns}
            rowKey={(record) => record.FirstName + record.LastName}
            pagination={false}
          />
        </div>
        {/* <Table
              dataSource={studentData}
              columns={studentColumns}
              rowKey={(record) => record.id}
            /> */}
        <div className="container">
          <Table
            title={() => "Groups"}
            dataSource={groups}
            columns={groupColumns2}
            rowKey={(record) => record.groupNumber}
            pagination={false}
          />
        </div>
      </body>
    </>
  );
};

export default Import;
