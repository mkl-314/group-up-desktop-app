import { read, utils } from "xlsx";
import {
  StudentFileData,
  StudentData,
  StudentChoiceData,
  StudentExcludeData,
} from "../types/Student";
import { generateStudentDataColumns } from "../types/studentColumns";
import { convertJsonToStudent, convertJsonToStudentData } from "./dataConversion";
import { handleErrorMessage } from "./messages";

export const uploadFileData = async (
  e: File,
  studentFile: StudentFileData[],
  students: StudentData[],
  choices: StudentChoiceData[],
  exclusions: StudentExcludeData[]
) => {
  try {
    console.log(e);
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
        //handleStudentConversion(jsonData);
        convertJsonToStudentData(jsonData, studentFile);
        convertJsonToStudent(jsonData, students, choices, exclusions);
      };
      reader.readAsArrayBuffer(e);
      return [e];
      //handleFileList(e);
      //setGroupSolutions(null);
    }
  } catch (err) {
    handleErrorMessage("Could not handle file: " + err.Message);
  }
};

export const isValidFile = (e: File) => {
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
