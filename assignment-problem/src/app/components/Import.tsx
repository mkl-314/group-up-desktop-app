import  { FC, useEffect, useState } from "react";
import * as React from "react";
import { GetGroups, SayHello } from "../greeting";
import {GroupData} from "../types/Groups";


const Import: FC = () => {
  const [eventName, setEventName] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [groups, setGroups] = useState<[GroupData]>();

  const saveEvent = async () => {
        const result = "hi"//await SayHello();
  };

  const cancelEvent = async () => {
    //alert("Are you sure you wish to cancel this event?");
    const result = await GetGroups("test", 4);
    console.log(result);
    result.then((data: React.SetStateAction<[GroupData]>) => {
        setGroups(data);
    })
    console.log(result);
  };

  const handleEventName = (e: any) => {
    setEventName(e.target.value);
  };

  useEffect(() => {
    const result = GetGroups("test", 4);
    console.log(result);
    result.then((data: React.SetStateAction<[GroupData]>) => {
        setGroups(data);
    })
    console.log(result);
  }, []);

  return (
    <>
      <h1>New Event</h1>
      <hr />
        <div className="form-container">
          <form onSubmit={saveEvent} className="form">
            <div className="button-container">
              <button
                type="submit"
                className="exit-button"
                value="Get Groups"
                onClick={() => {
                  cancelEvent();
                }}
              >

              </button>
            </div>
            <div className="event-col">
              <div className="event-row">
                <label>Event Name:</label>
                <input
                  className="event-box"
                  type="text"
                  value={eventName}
                  onChange={handleEventName}
                  placeholder="Enter event name"
                />
              </div>
              </div>
              <div>
              {groups &&
                groups.map((d, i) => (
                <div key={i}>
                    <h2>{"Event: " + d.student_id}</h2>
                    <h3>{"Organiser: " + d.students_name}</h3>
                    <hr />
                </div>
                ))}
                </div>
          </form>
        </div>
    </>
  );
};

export default Import;