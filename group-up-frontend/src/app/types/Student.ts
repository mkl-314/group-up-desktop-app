export interface StudentData {
  id: number;
  firstName: string;
  lastName: string;
}

export interface StudentFileData {
  firstName: string;
  lastName: string;
  [key: string]: string;
}

export interface StudentExcludeData {
  firstStudentId: number;
  secondStudentId: number;
}

export interface StudentChoiceData {
  chooserStudentId: number;
  chosenStudentId: number;
}
