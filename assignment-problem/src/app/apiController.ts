import { Connection, ConnectionBuilder } from "electron-cgi";
import { GroupData } from "./types/Groups";
import {
  StudentChoiceData,
  StudentData,
  StudentExcludeData
} from "./types/Student";

let connection: Connection = null;

setUpConnection();

function setUpConnection() {
  connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "../Core/Core")
    .build();
  connection.onDisconnect = () => {
    console.log("lost");
    setUpConnection();
  };
}

export const GetGroups = async (groupSize: number): Promise<[GroupData]> => {
  const result = await connection.send("GetGroups", groupSize);
  return result;
};

export const InsertStudents = async (studentData: StudentData[]): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudents", studentData);
    if (response.statusCode === 200) return true;
    throw new Error("Inserting students failed:");
  } catch (err) {
    console.log(err.Message);
    throw new Error("Inserting students failed: " + err.Message);
  }
};

export const InsertStudentChoices = async (studentData: StudentChoiceData[]): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudentChoices", studentData);
    if (response.statusCode === 200) return true;
    throw new Error("Inserting student choices failed:");
  } catch (err) {
    console.log(err.Message);
    throw new Error("Inserting student choices failed: " + err.Message);
  }
};

export const InsertStudentExclusions = async (
  studentData: StudentExcludeData[]
): Promise<boolean> => {
  try {
    const response = await connection.send("InsertStudentExclusions", studentData);
    if (response.statusCode === 200) return true;
    throw new Error("Inserting student exclusions failed:");
  } catch (err) {
    console.log(err.Message);
    throw new Error("Inserting student exclusions failed: " + err.Message);
  }
};
