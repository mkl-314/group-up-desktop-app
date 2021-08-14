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

    const result = await connection.send('greeting', 'John');
    console.log("from greeting page");

    return String(result);
}