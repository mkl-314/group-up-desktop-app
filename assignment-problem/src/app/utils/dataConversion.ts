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
  students: StudentData[],
  choices: StudentChoiceData[],
  exclusions: StudentExcludeData[]
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

export const convertJsonToStudentData = (jsonData: JSON[], fileData: StudentFileData[]) => {
  try {
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
          student[`choice${numChoices}`] = json[key];
          numChoices++;
        } else if (key1.match(/^exclude/i)) {
          student[`exclude${numExclusions}`] = json[key];
          numExclusions++;
        }
      }

      fileData.push(student);
    });
  } catch (err) {
    handleErrorMessage("Could not convert JSON to student data: " + err.message);
  }
};
