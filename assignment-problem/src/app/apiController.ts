import { Connection, ConnectionBuilder } from "electron-cgi";
import { GroupData, GroupData1 } from "./types/Groups";
import { StudentChoiceData, StudentData, StudentExcludeData } from "./types/Student";
//const connection = require('./connection').connection;

let connection: Connection = null;

setUpConnection();

export function setUpConnection() {
  connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "../Core/Core")
    .build();
  connection.onDisconnect = () => {
    console.log("lost");
    setUpConnection();
  };
}

export const GetGroups = async (groupSize: number): Promise<[GroupData1]> => {
  try {
    console.log("here");
    const response = await connection.send("GetGroups", groupSize);
    return response;
    // console.log(response);
    // if (response.statusCode === 200) return response.value;
  } catch (err) {
    console.log(err.Message);
    throw new Error("Could not generate groups: " + err.Message);
  }
};

export const InsertStudents = async (studentData: StudentData[]): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudents", studentData);
    if (response.statusCode === 200) return true;
    //throw new Error("Inserting students failed:");
  } catch (err) {
    console.log(err.Message);
    throw new Error("Inserting students failed: " + err.Message);
  }
};

export const InsertStudentChoices = async (studentData: StudentChoiceData[]): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudentChoices", studentData);
    console.log(response);
    if (response.statusCode === 200) return true;
    //throw new Error("Inserting student choices failed:");
  } catch (err) {
    throw new Error("Inserting student choices failed: " + err.Message);
  }
};

export const InsertStudentExclusions = async (
  studentData: StudentExcludeData[]
): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudentExclusions", studentData);
    console.log(response);
    if (response.statusCode === 200) return true;
    //throw new Error("Inserting student exclusions failed:");
  } catch (err) {
    throw new Error("Inserting student exclusions failed: " + err.Message);
  }
};
