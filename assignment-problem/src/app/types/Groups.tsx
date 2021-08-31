import * as React from "react";
import "../components/ComponentStyles.scss";

export interface Group {
  groupNumber: number;
  studentNames: string[];
}

export interface GroupSolution {
  groups: Group[];
}

export interface ExportGroup {
  "Group Number": number | string;
  "Student Name": string;
}

export const groupColumns = [
  {
    title: "Group Number",
    dataIndex: "groupNumber",
    key: "groupNumber",
    width: "fit-content",
  },
  {
    title: "Students",
    dataIndex: "studentNames",
    key: "studentNames",
    width: "fit-content",
    render: (text: string[]) => {
      return <>{text && text.map((d: string, i: any) => <div className="nowrap">{d}</div>)}</>;
    },
  },
];
