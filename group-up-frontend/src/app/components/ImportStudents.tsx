import { FC, useState } from "react";
import * as React from "react";
import { Button, Upload } from "antd";
import { ContainerOutlined, UploadOutlined } from "@ant-design/icons";
import "./ComponentStyles.scss";
import { read, utils } from "xlsx";
import {
  StudentChoiceData,
  StudentData,
  StudentExcludeData,
  StudentFileData,
  Data,
} from "../types/Student";
import { GroupSolution } from "../types/Groups";
import { generateStudentDataColumns } from "../types/studentColumns";
import { handleErrorMessage } from "../utils/messages";
import { useEffect } from "react";
import {
  convertJsonToPreferences,
  convertJsonToStudent,
  convertJsonToStudentData,
} from "../utils/dataConversion";
import { isValidFile } from "../utils/file";
import { ExportGroups } from "./ExportGroups";
import { GroupDisplay } from "./GroupDisplay";
import { Modals } from "./Modals";
import { GenerateGroups } from "./GenerateGroups";
import { AdvancedOptions } from "./AdvancedOptions";
const resolve = require("path").resolve;

const ImportStudents: FC = () => {
  const [studentFileData, setStudentFileData] = useState<StudentFileData[]>();
  const [fileList, setFileList] = useState<any[]>();
  const [groupSolutions, setGroupSolutions] = useState<GroupSolution[]>();
  const [data, setData] = useState<Data>();
  const [instructVisible, setInstructVisible] = useState(false);
  const [studentDataVisible, setStudentDataVisible] = useState(false);

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
          var headers: JSON = utils.sheet_to_json<JSON>(worksheet, { header: 1 }).shift();
          generateStudentDataColumns(headers);
          handleStudentConversion(jsonData, e);
        };
        reader.readAsArrayBuffer(e);
        // Reset values
        setFileList([e]);
        setGroupSolutions(null);
      }
    } catch (err) {
      handleErrorMessage("Could not handle file: " + err.Message);
    }
  };

  const uploadChange = (info: any) => {
    if (info.file.status === "removed") {
      setFileList(null);
      setGroupSolutions(null);
    }
  };

  const handleStudentConversion = async (jsonData: JSON[], fileList: any) => {
    try {
      const studentFile: StudentFileData[] = [];
      let students: StudentData[] = [];
      let choices: StudentChoiceData[] = [];
      let exclusions: StudentExcludeData[] = [];
      let data: Data;
      convertJsonToStudent(jsonData, students);
      convertJsonToPreferences(jsonData, students, choices, exclusions);
      convertJsonToStudentData(jsonData, studentFile, students);
      setStudentFileData(studentFile);

      data = {
        fileList: fileList,
        studentData: students,
        studentChoices: choices,
        studentExcludes: exclusions,
      };
      setData(data);
    } catch (err) {
      handleErrorMessage("Could not convert excel to table: " + err);
    }
  };

  const handleGroupSolutions = (result: GroupSolution[]) => {
    setGroupSolutions(result);
  };

  useEffect(() => {
    const studentDataDisplayCheck = document.getElementById("student-data-display");

    if (fileList) {
      studentDataDisplayCheck.classList.remove("no-display");
    } else {
      studentDataDisplayCheck.classList.add("no-display");
    }
  });

  return (
    <>
      <div className="body-container">
        <div className="header-container">
          <h1>GROUP UP</h1>
        </div>
        <div className="page">
          <Modals
            instructVisible={instructVisible}
            setInstructVisible={setInstructVisible}
            studentDataVisible={studentDataVisible}
            setStudentDataVisible={setStudentDataVisible}
            studentFileData={studentFileData}
          ></Modals>
          <Upload
            className="container upload"
            name="file"
            beforeUpload={fileHandler}
            onChange={uploadChange}
            fileList={fileList}
            multiple={false}
          >
            <Button type="default" className="constant-width">
              <UploadOutlined /> Upload Student Data
            </Button>
          </Upload>
          <Button
            type="default"
            onClick={() => setInstructVisible(true)}
            className="constant-width container button-instructions"
          >
            <ContainerOutlined /> Instructions
          </Button>
          <Button
            id="student-data-display"
            onClick={() => setStudentDataVisible(true)}
            className="constant-width button-student-data container no-display"
          >
            See Student Data
          </Button>
          {fileList && (
            <>
              <GenerateGroups
                handleGroupSolutions={handleGroupSolutions}
                data={data}
                advancedOptions={false}
              ></GenerateGroups>
              <AdvancedOptions
                handleGroupSolutions={handleGroupSolutions}
                data={data}
              ></AdvancedOptions>
            </>
          )}
          {groupSolutions && (
            <>
              <ExportGroups groupSolutions={groupSolutions}></ExportGroups>
              <GroupDisplay groupSolutions={groupSolutions}></GroupDisplay>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ImportStudents;
