export interface StudentData {
    id: number;
    firstName: string;
    lastName: string;
  }
  
export interface StudentFileData {
    firstName: string;
    lastName: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    //Choices: string[];
  }

export interface StudentExcludeData {
  firstStudent: string;
  secondStudent: string;
}

export interface StudentChoiceData {
  chooserStudent: string;
  chosenStudent: string;
}