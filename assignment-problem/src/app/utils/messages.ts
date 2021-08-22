import { message } from "antd";

message.config({
  maxCount: 1,
});

export const handleErrorMessage = (e: string, key?: string) => {
  message.error({
    content: e,
    //duration: 30,
    key: key,
    onClick: () => {
      message.destroy();
    },
  });
};

export const handleLoadingMessage = (content: string, key: string) => {
  message.loading({
    content: content,
    key: key,
    duration: 30,
  });
};

export const handleSuccessMessage = (content: string, key: string) => {
  message.success({
    content: content,
    key: key,
    duration: 3,
  });
};

export const handleWarningMessage = (content: string, key?: string) => {
  message.warning({
    content: content,
    duration: 5,
    key: "One Warning Only",
  });
};
