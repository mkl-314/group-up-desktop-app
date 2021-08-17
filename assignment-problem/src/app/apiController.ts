import { ConnectionBuilder } from "electron-cgi";
import { GroupData } from "./types/Groups";
import { StudentFileData } from "./types/Student";

let connection: any = null;

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

export const SayHello = async (): Promise<string> => {

    const result = await connection.send('greeting', 'MK');
    console.log(result);
    
    return result;
}

export const GetGroups = async (  
    studentFileData: [StudentFileData],  
    groupSize: number
    ): Promise<[GroupData]> => {
  const result = await connection.send('GetGroups', studentFileData, groupSize);
  return result;
}

  
export const InsertStudents = async (
  studentData: JSON[]
): Promise<number> => {
  const result = await connection.send('InsertStudents', studentData);
  console.log(result);
  return result;
}