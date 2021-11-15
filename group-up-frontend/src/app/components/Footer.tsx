import * as React from "react";
import { Credit, FooterWrapper, Spacer } from "./FooterStyles";
import { FC, useState } from "react";
import "./ComponentStyles.scss";
import { Button, Tooltip } from "antd";
import { MailOutlined } from "@ant-design/icons";

export const Footer: FC = () => {
  const toEmail = () => {
    window.location.href = "mailto:mingkimlow@gmail.com?Subject=Group Up App";
  };
  return (
    <>
      <FooterWrapper>
        <div>
          <Credit>
            Ming Kim Low
            <Spacer />
            Developer
            <Spacer />
            <Tooltip placement="top" title={"Email Ming Kim"}>
              <Button type="link" onClick={toEmail}>
                <MailOutlined></MailOutlined>
              </Button>
            </Tooltip>
          </Credit>
        </div>
      </FooterWrapper>
    </>
  );
};
