export interface Group {
  groupNumber: number;
  studentNames: string[];
}

export interface GroupSolution {
  groups: Group[];
}

export interface ExportGroup {
  "Group Number": number;
  "Student Name": string;
}
