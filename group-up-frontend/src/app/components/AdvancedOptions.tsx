import { FC, useState } from "react";
import * as React from "react";
import { Drawer, Button, Input } from "antd";
import "./ComponentStyles.scss";
import { GenerateGroups } from "./GenerateGroups";

export const AdvancedOptions = ({ handleGroupSolutions, data }: any) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button type="link" onClick={showDrawer} className="constant-width container">
        Advanced Options
      </Button>
      <Drawer
        title="Advanced Options"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={400}
      >
        <GenerateGroups
          handleGroupSolutions={handleGroupSolutions}
          data={data}
          advancedOptions={true}
        ></GenerateGroups>
      </Drawer>
    </>
  );
};
