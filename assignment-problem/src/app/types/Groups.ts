export interface GroupData {
  students_name: string;
  student_id: string;
}

export const groupColumns = [
  {
    title: "Names",
    dataIndex: "students_name",
    key: "students_names",
  },
  {
    title: "IDs",
    dataIndex: "student_id",
    key: "student_id",
  },
];

export interface GroupData1 {
  groupNumber: number,
  studentNames: string[],
  studentIds: string
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
  {
    title: "IDs",
    dataIndex: "studentIds",
    key: "studentIds",
  }
];