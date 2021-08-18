export interface StudentData {
  id: number;
  firstName: string;
  lastName: string;
}

export interface StudentFileData {
  FirstName: string;
  LastName: string;
  Choice1: string;
  Choice2: string;
  Choice3: string;
  Choice4: string;
  //Choices: string[];
}

export interface StudentExcludeData {
  firstStudentId: number;
  secondStudentId: number;
  // firstStudent: string;
  // secondStudent: string;
}

export interface StudentChoiceData {
  chooserStudentId: number;
  chosenStudentId: number;
  //   chooserStudent: string;
  //   chosenStudent: string;
}
