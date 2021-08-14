import { ConnectionBuilder } from "electron-cgi";

export const SayHello = async (): Promise<String> => {
    let connection = new ConnectionBuilder()
    .connectTo("dotnet", "run", "--project", "../Core/")
    .build();
    console.log("from greeting page 1");
    connection.onDisconnect = () => {
        console.log("lost");
        connection = new ConnectionBuilder().connectTo('dotnet', 'run', '--project', "../Core/").build();
    };

    const result = await connection.send('greeting', 'MK');
    console.log("from greeting page");

    return String(result);
}


export const GetGroups = async (
    project: string,
    groupSize: number
  ) => {
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
    console.log("Testing");
    if (!response.ok) throw new Error("Event creation failed!");
    const jsonData = await response.json();
    console.log("Testing5");
    return jsonData;
  };
  