import { Component, FC, useState } from "react";
import * as React from "react";
import { Table, Button, Upload, Input, Modal, Divider, Row, Col } from "antd";
import { BugTwoTone, ContainerOutlined, FireTwoTone, UploadOutlined } from "@ant-design/icons";
import "./ImportGroups.scss";
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
import { Group, GroupSolution } from "../types/Groups";
import { generateStudentDataColumns } from "../types/studentColumns";
import {
  handleWarningMessage,
  handleErrorMessage,
  handleLoadingMessage,
  handleSuccessMessage,
} from "../utils/messages";
import { useEffect } from "react";
import { useThemeSwitcher, ThemeSwitcherProvider } from "react-css-theme-switcher";
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
  const [solDisplayNum, setSolDisplayNum] = useState(1);
  const [isChecked, setIsChecked] = useState(true);
  const [theme, setTheme] = useState("light");
  const { switcher, currentTheme, status, themes } = useThemeSwitcher();
  const [instructVisible, setInstructVisible] = useState(false);
  const [studentDataVisible, setStudentDataVisible] = useState(false);

  const themes1 = {
    dark: resolve("./src/app/dark-theme.scss"),
    light: resolve("./src/app/light-theme.scss"),
  };

  const changeTheme = () => {
    console.log(themes);
    console.log(themes.dark);
    switcher({ theme: theme === "light" ? themes.dark : themes.light });

    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleGroupSize = (e: any) => {
    setGroupSize(e.target.value);
  };

  const fileHandler = async (e: File) => {
    try {
      console.log(e);
      // const studentFile: StudentFileData[] = [];
      // let students: StudentData[] = [];
      // let choices: StudentChoiceData[] = [];
      // let exclusions: StudentExcludeData[] = [];

      // const fileList = uploadFileData(e, studentFile, students, choices, exclusions);
      // fileList.then((file) => setFileList(file));
      // console.log(students);
      // console.log(studentFile);

      // setStudentData(students);
      // setStudentChoices(choices);
      // setStudentExcludes(exclusions);
      // setStudentFileData(studentFile);

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

  const removeFile = (e: any) => {
    setStudentData(null);
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
        console.log(studentData);
        console.log(studentChoices);
        let numSolution = 3;
        await GetGroups(+groupSize, numSolution).then((result) => {
          if (result !== null) {
            //setGroups(result);
            console.log(result);
            setGroupSolutions(result);
          } else {
            handleErrorMessage("Could not generate groups", "group");
          }
        });
        handleSuccessMessage("Groups have been generated!", "group");
      }
    } catch (err) {
      console.log(err);
      handleErrorMessage("Could not generate groups: " + err.message, "group");
    }
  };

  useEffect(() => {
    if (fileList) {
      const inputGroupSize = document.getElementById("input-group-size");
      inputGroupSize.classList.remove("no-display");

      const studentDataDisplayCheck = document.getElementById("student-data-display");
      studentDataDisplayCheck.classList.remove("no-display");
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
      <div className="page">
        <h1>Group Up</h1>
        <div className="theme-button">
          <Button onClick={changeTheme}>
            <FireTwoTone />
          </Button>
        </div>
        <hr />
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
          //onRemove={removeFile}
          fileList={fileList}
          multiple={false}
        >
          <Button type="primary">
            <UploadOutlined /> Upload Group Data
          </Button>
        </Upload>
        <Button
          type="primary"
          onClick={() => setInstructVisible(true)}
          className="button-instructions"
        >
          <ContainerOutlined /> Instructions
        </Button>
        <Button
          id="student-data-display"
          onClick={() => setStudentDataVisible(true)}
          className="button-student-data container no-display"
        >
          See Student Data
        </Button>
        <Input
          id="input-group-size"
          className="container input-group-size no-display"
          style={{ width: 150 }}
          onChange={handleGroupSize}
          maxLength={3}
          placeholder="Input group size"
          value={groupSize}
        ></Input>
        <Button
          id="btn-generate-groups"
          type="ghost"
          onClick={generateGroups}
          className="container"
        >
          <BugTwoTone /> Generate Groups
        </Button>
        {groupSolutions && <GroupDisplay groupSolutions={groupSolutions}></GroupDisplay>}
      </div>
    </>
  );
};

export default ImportStudents;
