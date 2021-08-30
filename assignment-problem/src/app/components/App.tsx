import * as React from "react";
import { FC } from "react";
import "./ComponentStyles.scss";
import { Footer } from "./Footer";
import ImportStudents from "./ImportStudents";

export const App: FC = () => {
  return (
    <>
      <ImportStudents></ImportStudents>
      <Footer></Footer>
    </>
  );
};
