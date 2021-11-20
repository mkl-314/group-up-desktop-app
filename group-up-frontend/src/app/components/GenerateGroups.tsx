import { FC, useEffect, useState } from "react";
import * as React from "react";
import { Button, Checkbox, Dropdown, Input, Select } from "antd";
import { ExperimentTwoTone } from "@ant-design/icons";
import "./ComponentStyles.scss";
import {
  handleErrorMessage,
  handleLoadingMessage,
  handleSuccessMessage,
  handleWarningMessage,
} from "../utils/messages";
import {
  GetGroups,
  GetGroupsAdvanced,
  InsertStudentChoices,
  InsertStudentExclusions,
  InsertStudents,
} from "../api/apiController";

const { Option } = Select;

export const GenerateGroups = ({ handleGroupSolutions, data, advancedOptions }: any) => {
  const [groupSize, setGroupSize] = useState("");
  const [numChoice, setNumChoice] = useState(1);
  const [maxTime, setMaxTime] = useState(15);
  const [disableGenerateBtn, setDisableGenerateBtn] = useState(true);
  const numSolution = 3;

  const handleGroupSize = (e: any) => {
    setGroupSize(e.target.value);
  };

  const handleMinChoice = (e: any) => {
    setNumChoice(e.target.checked ? 1 : 0);
  };

  const handleMaxTime = (e: any) => {
    setMaxTime(e);
  };
  const generateGroups = async () => {
    try {
      if (validateGroupSize(groupSize)) {
        handleLoadingMessage("Generating Groups", "group");
        await InsertStudents(data.studentData);
        await InsertStudentChoices(data.studentChoices);
        await InsertStudentExclusions(data.studentExcludes);
        await GetGroupsAdvanced(+groupSize, numSolution, numChoice, maxTime).then((result) => {
          if (result !== null) {
            handleGroupSolutions(result);
          } else {
            handleErrorMessage("Could not generate groups.", "group");
          }
        });
        handleSuccessMessage("Groups have been generated!", "group");
      }
    } catch (err) {
      console.log(err);
      handleErrorMessage("Could not generate groups: " + err.message, "group");
    }
  };

  const validateGroupSize = (groupSize: any) => {
    if (!groupSize.match(/^[0-9]*$/)) {
      handleWarningMessage("Please input a positive integer.");
    } else if (data.studentData && data.studentData.length < +groupSize) {
      handleWarningMessage("Group size cannot be greater than the number of students.");
    } else if (data.studentData && +groupSize > data.studentData.length / 2) {
      handleWarningMessage("Group size will result in only one group!");
    } else if ((groupSize && +groupSize == 0) || +groupSize == 1) {
      handleWarningMessage("Group size can't be " + groupSize);
    } else if (groupSize) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (data) {
      const isValidGroup = validateGroupSize(groupSize);
      setDisableGenerateBtn(!isValidGroup);
    }
  });

  return (
    <>
      <div className="container block" style={{ lineHeight: "3em", fontSize: "16px" }}>
        Input group size:
        <Input
          id="input-group-size"
          className="constant-width input-group-size"
          onChange={handleGroupSize}
          maxLength={3}
          placeholder="Group size"
          value={groupSize}
        ></Input>
      </div>
      {advancedOptions && (
        <>
          <div
            className="container block"
            style={{ paddingBottom: "20px", fontSize: "16px", marginBottom: "5px" }}
          >
            Maximum loading time (in seconds): <br />
            <Select
              defaultValue={15}
              style={{ width: 100 }}
              onChange={handleMaxTime}
              className="constant-width"
            >
              <Option value={15}>15</Option>
              <Option value={30}>30</Option>
              <Option value={60}>60</Option>
              <Option value={120}>120</Option>
            </Select>
            <Checkbox onChange={handleMinChoice} defaultChecked={true} className="container">
              Each person must have at least one choice in their group.
            </Checkbox>
          </div>
        </>
      )}
      <Button
        id={"btn-generate-groups-" + advancedOptions}
        type="primary"
        onClick={generateGroups}
        className="constant-width container"
        disabled={disableGenerateBtn}
      >
        <ExperimentTwoTone twoToneColor="#ffffff" /> Generate Groups
      </Button>
    </>
  );
};
