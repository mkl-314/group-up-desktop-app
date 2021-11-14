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
  InsertStudentChoices,
  InsertStudentExclusions,
  InsertStudents,
} from "../api/apiController";

const { Option } = Select;

export const GenerateGroups = ({ handleGroupSolutions, data, advancedOptions }: any) => {
  const [groupSize, setGroupSize] = useState("");
  const [minChoice, setMinChoice] = useState(true);
  const [maxTime, setMaxTime] = useState();
  const numSolution = 3;

  const handleGroupSize = (e: any) => {
    setGroupSize(e.target.value);
  };

  const handleMinChoice = (e: any) => {
    setMinChoice(e.target.checked);
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
        await GetGroups(+groupSize, numSolution).then((result) => {
          if (result !== null) {
            handleGroupSolutions(result);
            console.log("it worked");
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
      // Toggle display of generate groups button
      const btnGenerateGroups = document.getElementById("btn-generate-groups-" + advancedOptions);
      if (isValidGroup) {
        btnGenerateGroups.classList.remove("no-display");
      } else {
        btnGenerateGroups.classList.add("no-display");
      }
    }
  });

  return (
    <>
      <Input
        id="input-group-size"
        className="container constant-width input input-group-size"
        onChange={handleGroupSize}
        maxLength={3}
        placeholder="Input group size"
        value={groupSize}
      ></Input>
      {advancedOptions && (
        <>
          <Checkbox onChange={handleMinChoice} defaultChecked={true}>
            Each person must have at least one choice in their group.
          </Checkbox>
          <div>Maximum loading time (in seconds):</div>
          <Select defaultValue={15} style={{ width: 100 }} onChange={handleMaxTime}>
            <Option value={15}>15</Option>
            <Option value={30}>30</Option>
            <Option value={60}>60</Option>
            <Option value={120}>120</Option>
          </Select>
        </>
      )}
      <Button
        id={"btn-generate-groups-" + advancedOptions}
        type="primary"
        onClick={generateGroups}
        className="constant-width container"
      >
        <ExperimentTwoTone twoToneColor="#000000" /> Generate Groups
      </Button>
    </>
  );
};
