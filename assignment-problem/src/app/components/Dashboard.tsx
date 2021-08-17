import {FC, useState, useEffect} from "react";
import * as React from "react";
import { ipcRenderer } from "electron";
import { SayHello } from "../apiController";

// export const Dashboard: FC = () => {
//   const [greeting, setGreeting] = useState<string>();
  
//   useEffect(() => {
//     console.log("fkn work");
//     //setGreeting(String(SayHello()));
//   });

//   return (
//     <>
//     <div className="">
//       <input 
//       type="label"
//       value={greeting} />
//     </div>
//     </>
//   );
// };

interface IState {
  message: string;
}

export class Dashboard extends React.Component<{}, IState> {
  public state: IState = {
    message: ""
  };

  public componentDidMount(): void {
    ipcRenderer.on("greeting", this.onMessage);
  }

  public componentWillUnmount(): void {
    ipcRenderer.removeAllListeners("greeting");
  }

  public render(): React.ReactNode {
    return <div>{this.state.message}</div>;
  }

  private onMessage = (event: any, message: string) => {
    console.log("This message:" + message);
    this.setState({ message: message });
  };
}

// export default Dashboard;
