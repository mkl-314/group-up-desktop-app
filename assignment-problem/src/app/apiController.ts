import { setUpConnection } from "./connection";
import { Solution, GroupSolution } from "./types/Groups";
import { StudentChoiceData, StudentData, StudentExcludeData } from "./types/Student";
//const connection = require("./connection").connection;
const connection = setUpConnection();

export const GetGroups1 = async (groupSize: number, numSolutions: number): Promise<Solution[]> => {
  try {
    const response = await connection.send("GetGroups", {
      groupSize: groupSize,
      numSolutions: numSolutions,
    });
    console.log(response);
    if (response.statusCode === 200) return response.value;
    throw new Error(response.value);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const GetGroups = async (
  groupSize: number,
  numSolutions: number
): Promise<GroupSolution[]> => {
  try {
    const response = await connection.send("GetGroups", {
      groupSize: groupSize,
      numSolutions: numSolutions,
    });
    console.log(response);
    if (response.statusCode === 200) return response.value;
    console.log(response.value);
    throw new Error(response.value);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

export const InsertStudents = async (studentData: StudentData[]): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudents", studentData);
    if (response.statusCode === 200) return true;
  } catch (err) {
    console.log(err);
    console.log(err.Message);
    throw new Error(err);
  }
};

export const InsertStudentChoices = async (studentData: StudentChoiceData[]): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudentChoices", studentData);
    if (response.statusCode === 200) return true;
  } catch (err) {
    throw new Error("Inserting student choices failed: " + err.message);
  }
};

export const InsertStudentExclusions = async (
  studentData: StudentExcludeData[]
): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudentExclusions", studentData);
    if (response.statusCode === 200) return true;
    //throw new Error("Inserting student exclusions failed:");
  } catch (err) {
    throw new Error("Inserting student exclusions failed: " + err.message);
  }
};
