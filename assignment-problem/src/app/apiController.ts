import { ConnectionBuilder } from "electron-cgi";
import { GroupData } from "./types/Groups";
import { StudentFileData } from "./types/Student";

let connection: any = null;

setUpConnection();

function setUpConnection() {
    connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "../Core/Core")
    .build();
  console.log("from greeting page 1");
  connection.onDisconnect = () => {
      console.log("lost");
      setUpConnection();
  };
}

export const SayHello = async (): Promise<string> => {

    const result = await connection.send('greeting', 'MK');
    console.log(result);
    
    return result;
}

export const GetGroups = async (  
    studentFileData: [StudentFileData],  
    groupSize: number
    ): Promise<[GroupData]> => {
  const result = await connection.send('GetGroups', groupSize);
  return result;
}

export const GetGroupsAPI = async (
    project: string,
    groupSize: number
  ): Promise<[GroupData]> => {
  const requestData = {
      project: project,
    groupSize: groupSize
  };
  const response = await fetch("https://localhost:44308/Assignment", {
    method: "get",
    headers: {
      "Content-Type": "text/plain",
    }
  });
  if (!response.ok) throw new Error("Event creation failed!");
  const jsonData = await response.json();
  return jsonData;
};
  
export const InsertStudents = async (
  studentData: JSON[]
): Promise<number> => {
  const result = await connection.send('InsertStudents', studentData);
  console.log(result);
  return result;
}