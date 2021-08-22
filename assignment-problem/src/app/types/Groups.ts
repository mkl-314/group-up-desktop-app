export interface Solution {
  groupNumber: number;
  studentNames: string[];
}

export const groupColumns1 = [
  {
    title: "Group Number",
    dataIndex: "groupNumber",
    key: "groupNumber",
  },
  {
    title: "Students",
    dataIndex: "studentNames",
    key: "studentNames",
  },
];

export interface GroupSolution {
  groups: Solution[];
}
