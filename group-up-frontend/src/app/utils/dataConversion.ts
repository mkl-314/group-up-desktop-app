import {
  StudentChoiceData,
  StudentData,
  StudentExcludeData,
  StudentFileData,
} from "../types/Student";
import { handleErrorMessage } from "./messages";

export const convertJsonToStudent = (
  jsonData: JSON[],
  //fileData: StudentFileData[],
  students: StudentData[]
) => {
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
};

export const convertJsonToPreferences = (
  jsonData: JSON[],
  //fileData: StudentFileData[],
  students: StudentData[],
  choices: StudentChoiceData[],
  exclusions: StudentExcludeData[]
) => {
  jsonData.map((d, i) => {
    let json = JSON.parse(JSON.stringify(d));
    for (const key in json) {
      var key1 = key.replace(" ", "");
      //console.log(key);
      if (key1.match(/^choice/i)) {
        const studentId = getStudentId(json[key], students);
        if (studentId >= 0) {
          choices.push({
            chooserStudentId: i,
            chosenStudentId: studentId,
          });
        }
      } else if (key1.match(/^exclude/i)) {
        const studentId = getStudentId(json[key], students);
        if (studentId >= 0) {
          exclusions.push({
            firstStudentId: i,
            secondStudentId: studentId,
          });
        }
      }
    }
  });
};

function getStudentId(name: string, students: StudentData[]): number {
  let studentIndex = students.findIndex((student) => {
    return isNameStudent(name, student);
  });
  // Check if name matches multiple students
  const numMatchStudents = students.filter((student) => {
    return isNameStudent(name, student);
  }).length;
  if (numMatchStudents > 1) {
    return -1;
  }
  return studentIndex;
}

function isNameStudent(name: string, student: StudentData): boolean {
  switch (name.toLowerCase().trim()) {
    case student.firstName.toLowerCase():
    case (student.firstName + " " + student.lastName[0]).toLowerCase():
    case (student.firstName + " " + student.lastName).toLowerCase(): {
      return true;
    }
    default:
      return false;
  }
}

export const convertJsonToStudentData = (
  jsonData: JSON[],
  fileData: StudentFileData[],
  students: StudentData[]
) => {
  try {
    let dataError = false;
    jsonData.map((d, i) => {
      let json = JSON.parse(JSON.stringify(d));

      let numChoices: number = 1;
      let numExclusions: number = 1;

      const student: StudentFileData = {
        firstName: "",
        lastName: "",
      };

      for (const key in json) {
        var key1 = key.replace(" ", "");
        if (key1.match(/^firstname/i)) {
          student.firstName = json[key];
        } else if (key1.match(/^lastname/i)) {
          student.lastName = json[key];
        } else if (key1.match(/^choice/i)) {
          const studentId = getStudentId(json[key], students);
          if (studentId >= 0) {
            student[`choice${numChoices}`] = json[key];
          } else {
            // student is not recognised. Exclamation tells student columns to highlight red
            student[`choice${numChoices}`] = json[key] + "!";
            handleErrorMessage(
              `Students not recognised: click See Student Data button to see unrecognised students.`
            );
            dataError = true;
          }
          numChoices++;
        } else if (key1.match(/^exclude/i)) {
          const studentId = getStudentId(json[key], students);
          if (studentId >= 0) {
            student[`exclude${numExclusions}`] = json[key];
          } else {
            // student is not recognised. Exclamation tells student columns to highlight red
            student[`exclude${numExclusions}`] = json[key] + "!";
            handleErrorMessage(
              `Students not recognised: click See Student Data button to see unrecognised students.`
            );
            dataError = true;
          }
          numExclusions++;
        }
      }

      fileData.push(student);
    });
    return dataError;
  } catch (err) {
    handleErrorMessage("Could not convert JSON to student data: " + err.message);
    return false;
  }
};
