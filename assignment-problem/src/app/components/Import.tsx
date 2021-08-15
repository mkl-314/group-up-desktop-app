import  { FC, useEffect, useState } from "react";
import * as React from "react";
import { GetGroups, SayHello } from "../greeting";
import {GroupData} from "../types/Groups";
import './Import.scss';

const Import: FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [groups, setGroups] = useState<[GroupData]>();

  const saveEvent = async () => {
    const result2 = await SayHello();
    setEventName(result2);
    // result2.then((data: any ) => {
    //   setEventName(data);
    // } )
  };

  const cancelEvent = async () => {
    //alert("Are you sure you wish to cancel this event?");
    const result = await GetGroups("test", 4);
    console.log(result);
    setGroups(result);
    // result.then((data: React.SetStateAction<[GroupData]>) => {
    //     setGroups(data);
    // })
  };

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
              <button
                type="button"
                className="import-button"
                value="Get Groups"
                onClick={() => {
                  cancelEvent();
                  saveEvent();
                }}
              >Get Groups</button>
            </div>
            <div className="event-col">
              <div className="event-row">
                <label>Student Names:</label>
                <input
                  className=""
                  type="text"
                  value={eventName}
                  placeholder="Enter students"
                />
              </div>
              </div>
              <div>
                <div>{eventName}</div>
              {groups &&
                groups.map((d, i) => (
                <div key={i}>
                    <h2>{"Group : " + d.student_id}</h2>
                    <h3>{"Students: " + d.students_name}</h3>
                    <hr />
                </div>
                ))}
                </div>
        </div>
    </>
  );
};

export default Import;