import { FC, useEffect, useState } from "react";
import * as React from "react";
import { GetGroups } from "../apiController";
import "./Import.scss";
import { StudentFileData } from "../types/Student";

const Import: FC = () => {
  const [eventName, setEventName] = useState<string>("");

  const handleEventName = (e: any) => {
    setEventName(e.target.value);
  };

  useEffect(() => {
    // const result = GetGroups("test", 4);
    // result.then((data: React.SetStateAction<[GroupData]>) => {
    //     setGroups(data);
    // })
    // const result2 = SayHello();
    // result2.then((data: any ) => {
    //   setEventName(data);
    // } )
  }, []);

  return (
    <>
      <h1>Group Up</h1>
      <hr />
      <div className="form-container">
        <div className="button-container">
          <button type="button" className="import-button" value="Get Groups">
            Get Groups
          </button>
        </div>
        <div className="event-col">
          <div className="event-row">
            <label>Student Names:</label>
            <input className="" type="text" value={eventName} placeholder="Enter students" />
          </div>
        </div>
        <div>
          <div>{eventName}</div>
        </div>
      </div>
    </>
  );
};

export default Import;
