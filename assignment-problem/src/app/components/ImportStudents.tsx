import { FC, useState } from "react";
import * as React from "react";
import { Button, Upload, Input } from "antd";
import { ContainerOutlined, ExperimentTwoTone, UploadOutlined } from "@ant-design/icons";
import "./ComponentStyles.scss";
import { read, utils } from "xlsx";
import {
  GetGroups,
  InsertStudentChoices,
  InsertStudentExclusions,
  InsertStudents,
} from "../api/apiController";
import {
  StudentChoiceData,
  StudentData,
  StudentExcludeData,
  StudentFileData,
} from "../types/Student";
import { GroupSolution } from "../types/Groups";
import { generateStudentDataColumns } from "../types/studentColumns";
import {
  handleWarningMessage,
  handleErrorMessage,
  handleLoadingMessage,
  handleSuccessMessage,
} from "../utils/messages";
import { useEffect } from "react";
import { convertJsonToStudent, convertJsonToStudentData } from "../utils/dataConversion";
import { isValidFile, uploadFileData } from "../utils/file";
import { ExportGroups } from "./ExportGroups";
import { GroupDisplay } from "./GroupDisplay";
import { Modals } from "./Modals";
const resolve = require("path").resolve;

const ImportStudents: FC = () => {
  const [groupSize, setGroupSize] = useState("");
  const [studentFileData, setStudentFileData] = useState<StudentFileData[]>();
  const [fileList, setFileList] = useState<any[]>();
  const [studentData, setStudentData] = useState<StudentData[]>();
  const [studentChoices, setStudentChoices] = useState<StudentChoiceData[]>();
  const [studentExcludes, setStudentExcludes] = useState<StudentExcludeData[]>();
  const [groupSolutions, setGroupSolutions] = useState<GroupSolution[]>();
  const [instructVisible, setInstructVisible] = useState(false);
  const [studentDataVisible, setStudentDataVisible] = useState(false);
  const numSolution = 3;

  const handleGroupSize = (e: any) => {
    setGroupSize(e.target.value);
  };

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
          handleStudentConversion(jsonData);
        };
        reader.readAsArrayBuffer(e);
        // Reset values
        setFileList([e]);
        setGroupSolutions(null);
        setGroupSize("");
      }
    } catch (err) {
      handleErrorMessage("Could not handle file: " + err.Message);
    }
  };

  const uploadChange = (info: any) => {
    if (info.file.status === "removed") {
      setFileList(null);
      setGroupSolutions(null);
      setGroupSize("");
    }
  };

  const handleStudentConversion = async (jsonData: JSON[]) => {
    try {
      const studentFile: StudentFileData[] = [];
      let students: StudentData[] = [];
      let choices: StudentChoiceData[] = [];
      let exclusions: StudentExcludeData[] = [];

      convertJsonToStudentData(jsonData, studentFile);
      convertJsonToStudent(jsonData, students, choices, exclusions);

      setStudentData(students);
      setStudentChoices(choices);
      setStudentExcludes(exclusions);
      setStudentFileData(studentFile);
    } catch (err) {
      handleErrorMessage("Could not convert excel to table: " + err);
    }
  };

  const generateGroups = async () => {
    try {
      console.log(groupSize);
      if (isNaN(+groupSize)) {
        handleWarningMessage("Group size must be a number!");
      } else if (+groupSize < 1) {
        handleWarningMessage("Group size must not be zero!");
      } else {
        handleLoadingMessage("Generating Groups", "group");
        await InsertStudents(studentData);
        await InsertStudentChoices(studentChoices);
        await InsertStudentExclusions(studentExcludes);

        await GetGroups(+groupSize, numSolution).then((result) => {
          if (result !== null) {
            setGroupSolutions(result);
          } else {
            handleErrorMessage("Could not generate groups", "group");
          }
        });
        handleSuccessMessage("Groups have been generated!", "group");
      }
    } catch (err) {
      handleErrorMessage("Could not generate groups: " + err.message, "group");
    }
  };

  useEffect(() => {
    if (fileList) {
      const inputGroupSize = document.getElementById("input-group-size");
      inputGroupSize.classList.remove("no-display");

      const studentDataDisplayCheck = document.getElementById("student-data-display");
      studentDataDisplayCheck.classList.remove("no-display");
    } else {
      const inputGroupSize = document.getElementById("input-group-size");
      inputGroupSize.classList.add("no-display");

      const studentDataDisplayCheck = document.getElementById("student-data-display");
      studentDataDisplayCheck.classList.add("no-display");
    }

    const isValidGroup = validateGroupSize(groupSize);
    // Toggle display of generate groups button
    const btnGenerateGroups = document.getElementById("btn-generate-groups");
    if (fileList && isValidGroup) {
      btnGenerateGroups.classList.remove("no-display");
    } else {
      btnGenerateGroups.classList.add("no-display");
    }
  });

  const validateGroupSize = (groupSize: any) => {
    if (isNaN(+groupSize)) {
      handleWarningMessage("Please input a number.");
    } else if (studentData && studentData.length <= +groupSize) {
      handleWarningMessage("Group size cannot be greater than the number of students.");
    } else if (studentData && +groupSize > studentData.length / 2) {
      handleWarningMessage("Group size will result in only one group!");
    } else if (groupSize) {
      return true;
    }
    return false;
  };

  return (
    <>
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
            <UploadOutlined /> Upload Group Data
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
        <Input
          id="input-group-size"
          className="container constant-width input input-group-size no-display"
          onChange={handleGroupSize}
          maxLength={3}
          placeholder="Input group size"
          value={groupSize}
        ></Input>
        <Button
          id="btn-generate-groups"
          type="primary"
          onClick={generateGroups}
          className="constant-width container"
        >
          <ExperimentTwoTone twoToneColor="#1f1f1f" /> Generate Groups
        </Button>
        {groupSolutions && <ExportGroups groupSolutions={groupSolutions}></ExportGroups>}
        {groupSolutions && <GroupDisplay groupSolutions={groupSolutions}></GroupDisplay>}
      </div>
    </>
  );
};

export default ImportStudents;
