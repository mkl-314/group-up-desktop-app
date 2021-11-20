import { message } from "antd";
import "../styles/antdModify.scss";

message.config({
  maxCount: 1,
});

export const handleErrorMessage = (e: string, key?: string) => {
  message.error({
    content: e,
    duration: 30,
    key: key,
    onClick: () => {
      message.destroy();
    },
    style: {
      marginTop: "-30px",
    },
  });
};

export const handleLoadingMessage = (content: string, key: string) => {
  message.loading({
    content: content,
    key: key,
    duration: 0,
    style: {
      marginTop: "-30px",
    },
  });
};

export const handleSuccessMessage = (content: string, key: string) => {
  message.success({
    content: content,
    key: key,
    duration: 3,
    style: {
      marginTop: "-30px",
    },
  });
};

export const handleWarningMessage = (content: string, key?: string) => {
  message.warning({
    content: content,
    duration: 5,
    key: "One Warning Only",
    style: {
      marginTop: "-30px",
    },
  });
};
