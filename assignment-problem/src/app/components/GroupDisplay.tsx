import { Button, Divider, Table } from "antd";
import * as React from "react";
import { ExportGroups } from "./ExportGroups";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useEffect } from "react";

export const groupColumns2 = [
  {
    title: "Group Number",
    dataIndex: "groupNumber",
    key: "groupNumber",
  },
  {
    title: "Students",
    dataIndex: "studentNames",
    key: "studentNames",
    render: (text: string[], row: any, index: any) => {
      return <>{text && text.map((d: string, i: any) => <div>{d}</div>)}</>;
    },
  },
];

export const GroupDisplay = ({ groupSolutions: groupSolutions }: any) => {
  const [solDisplayNum, setSolDisplayNum] = useState(1);

  useEffect(() => {
    console.log(solDisplayNum);
  });

  const getNextSolution = () => {
    if (groupSolutions && solDisplayNum < groupSolutions.length) {
      const solution = document.getElementById(`solution${solDisplayNum + 1}`);
      const hideSolution = document.getElementById(`solution${solDisplayNum}`);
      solution.classList.remove("no-display");
      hideSolution.classList.add("no-display");

      // if (solDisplayNum + 1 >= groupSolutions.length) {
      //   const rightButton = document.getElementById("rightButton");
      //   rightButton.classList.add("hide");
      // }
      // const leftButton = document.getElementById("leftButton");
      // leftButton.classList.remove("hide");

      setSolDisplayNum(solDisplayNum + 1);
    }
  };
  const getPrevSolution = () => {
    if (groupSolutions && solDisplayNum > 1) {
      const solution = document.getElementById(`solution${solDisplayNum - 1}`);
      const hideSolution = document.getElementById(`solution${solDisplayNum}`);
      solution.classList.remove("no-display");
      hideSolution.classList.add("no-display");

      // if (solDisplayNum <= 1) {
      //   const leftButton = document.getElementById("leftButton");
      //   leftButton.classList.add("hide");
      // }
      // const rightButton = document.getElementById("rightButton");
      // rightButton.classList.remove("hide");

      setSolDisplayNum(solDisplayNum - 1);
    }
  };

  return (
    <>
      <div>
        <Divider orientation="left">Groups</Divider>
        <ExportGroups groupSolutions={groupSolutions}></ExportGroups>
        <div className="container solution-nav">
          <Button
            id="leftButton"
            type="ghost"
            onClick={getPrevSolution}
            className={`${solDisplayNum <= 1 ? "hide" : ""}`}
          >
            <LeftOutlined />
          </Button>
          <div className="solution-button-container container">
            <div className="solution-number">{`${solDisplayNum} of ${
              groupSolutions ? groupSolutions.length : 0
            }`}</div>
          </div>
          <Button
            id="rightButton"
            type="ghost"
            onClick={getNextSolution}
            className={`${groupSolutions && solDisplayNum >= groupSolutions.length ? "hide" : ""}`}
          >
            <RightOutlined />
          </Button>
        </div>
        <div className="container">
          {groupSolutions &&
            groupSolutions.map((d: any, i: number) => (
              <div
                id={`solution${i + 1}`}
                key={i}
                className={`container ${i + 1 !== solDisplayNum ? "no-display" : ""}`}
              >
                <Table
                  //title={() => "Group " + (i + 1)}
                  dataSource={d.groups}
                  columns={groupColumns2}
                  rowKey={(record) => record.groupNumber}
                  pagination={false}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
