export const generateStudentDataColumns = (headers: any) => {
  var choiceColumns: any[] = [];
  var excludeColumns: any[] = [];
  let numChoices = 1;
  let numExclusions = 1;
  console.log(headers);

  for (const key in headers) {
    console.log(key);
    var header: string = headers[key];
    var header1 = header.replace(" ", "");
    if (header1.match(/^choice/i)) {
      choiceColumns = [
        ...choiceColumns,
        {
          title: `Choice ${numChoices}`,
          dataIndex: `choice${numChoices}`,
          key: `choice${numChoices}`,
        },
      ];
      numChoices++;
    } else if (header1.match(/^exclude/i)) {
      excludeColumns = [
        ...excludeColumns,
        {
          title: `Exclude ${numExclusions}`,
          dataIndex: `exclude${numExclusions}`,
          key: `exclude${numExclusions}`,
        },
      ];
      numExclusions++;
    }
  }
  console.log(numChoices);
  console.log(numExclusions);

  studentDataColumns = [...studentColumns, ...choiceColumns, ...excludeColumns];
  studentChoiceColumns = choiceColumns;
  studentExcludeColumns = excludeColumns;
  console.log(columns);
};

export var columns = [
  {
    title: "First Name",
    dataIndex: "FirstName",
    key: "FirstName",
  },
  {
    title: "Last Name",
    dataIndex: "LastName",
    key: "LastName",
  },
  {
    title: "Choice 1",
    dataIndex: "Choice1",
    key: "Choice1",
  },
  {
    title: "Choice 2",
    dataIndex: "Choice2",
    key: "Choice2",
  },
  {
    title: "Choice 3",
    dataIndex: "Choice3",
    key: "Choice3",
  },
  {
    title: "Choice 4",
    dataIndex: "Choice4",
    key: "Choice4",
  },
];
export var studentDataColumns: any;

export const studentColumns = [
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName",
  },
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName",
  },
];

export var studentChoiceColumns: any[];

export var studentExcludeColumns: any[];
