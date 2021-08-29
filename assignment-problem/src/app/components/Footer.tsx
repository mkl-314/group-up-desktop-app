import * as React from "react";
import { Credit, FooterWrapper, Spacer } from "./FooterStyles";
import { FC, useState } from "react";
import "./ComponentStyles.scss";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

export const Footer: FC = () => {
  return (
    <>
      <FooterWrapper>
        <div>
          <div>Created by:</div>
          <Credit>
            Ming Kim Low
            <Spacer />
            Development
            <Spacer />
            {/* <SocialIcon
              eventLabel="Ming Kim GitHub"
              to={"https://github.com/mkl-314"}
              name="github"
            /> */}
            <Button>
              <MailOutlined></MailOutlined>
            </Button>
          </Credit>
        </div>
      </FooterWrapper>
    </>
  );
};
