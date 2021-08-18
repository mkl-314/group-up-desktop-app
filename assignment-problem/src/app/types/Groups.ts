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
