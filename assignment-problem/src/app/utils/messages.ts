import { message } from "antd";
import "../components/antdModify.scss";

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
    className: "message",
    style: {
      marginTop: "80px",
    },
  });
};

export const handleLoadingMessage = (content: string, key: string) => {
  message.loading({
    content: content,
    key: key,
    duration: 0,
    className: "message",
    style: {
      marginTop: "80px",
    },
  });
};

export const handleSuccessMessage = (content: string, key: string) => {
  message.success({
    content: content,
    key: key,
    duration: 3,
    className: "message",
    style: {
      marginTop: "80px",
    },
  });
};

export const handleWarningMessage = (content: string, key?: string) => {
  message.warning({
    content: content,
    duration: 5,
    key: "One Warning Only",
    className: "message",
    style: {
      marginTop: "80px",
    },
  });
};
