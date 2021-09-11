import { Button, Table } from "antd";
import * as React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { groupColumns } from "../types/Groups";
import "./ComponentStyles.scss";

export const GroupDisplay = ({ groupSolutions: groupSolutions }: any) => {
  const [solDisplayNum, setSolDisplayNum] = useState(1);

  const getNextSolution = () => {
    if (groupSolutions && solDisplayNum < groupSolutions.length) {
      const solution = document.getElementById(`solution${solDisplayNum + 1}`);
      const hideSolution = document.getElementById(`solution${solDisplayNum}`);
      solution.classList.remove("no-display");
      hideSolution.classList.add("no-display");

      setSolDisplayNum(solDisplayNum + 1);
    }
  };
  const getPrevSolution = () => {
    if (groupSolutions && solDisplayNum > 1) {
      const solution = document.getElementById(`solution${solDisplayNum - 1}`);
      const hideSolution = document.getElementById(`solution${solDisplayNum}`);
      solution.classList.remove("no-display");
      hideSolution.classList.add("no-display");

      setSolDisplayNum(solDisplayNum - 1);
    }
  };

  return (
    <>
      <div>
        <div className="container solution-nav">
          <Button
            id="leftButton"
            type="default"
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
            type="default"
            onClick={getNextSolution}
            className={`${groupSolutions && solDisplayNum >= groupSolutions.length ? "hide" : ""}`}
          >
            <RightOutlined />
          </Button>
        </div>
        <div className="group-container">
          {groupSolutions &&
            groupSolutions.map((d: any, i: number) => (
              <div
                key={i}
                id={`solution${i + 1}`}
                className={`container ${i + 1 !== solDisplayNum ? "no-display" : ""}`}
              >
                <Table
                  dataSource={d.groups}
                  columns={groupColumns}
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
