import { Component } from "react";
import * as React from "react";
import 'antd/dist/antd.css';
import { Table, Button, Popconfirm, Row, Col, Upload} from "antd";
import { FileProtectOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
// import { ExcelRenderer } from "react-excel-renderer";
import {read, WorkBook, utils, readFile} from 'xlsx';
//import { EditableFormRow, EditableCell } from "../utils/editable";
import { InsertStudents } from "../greeting";

interface MyState {
    cols: any[],
      rows: any[],
      errorMessage: string,
      columns: [
        {
          title: string,
          dataIndex: string,
          editable: boolean
        },
        {
            title: string,
            dataIndex: string,
            editable: boolean
          }
        // {
        //   title: "Action",
        //   dataIndex: "action",
        //   render: (text: any, record: { key: any; }) =>
        //     this.state.rows.length >= 1 ? (
        //       <Popconfirm
        //         title="Sure to delete?"
        //         onConfirm={() => this.handleDelete(record.key)}
        //       >
        //         <Icon
        //           type="delete"
        //           theme="filled"
        //           style={{ color: "red", fontSize: "20px" }}
        //         />
        //       </Popconfirm>
        //     ) : null
        // }
      ]
}
export default class ExcelPage extends Component<{}, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      cols: [],
      rows: [],
      errorMessage: null,
      columns: [
        {
          title: "First name",
          dataIndex: "firstname",
          editable: true
        },
        {
          title: "Last name",
          dataIndex: "lastname",
          editable: true
        }
        // {
        //   title: "Action",
        //   dataIndex: "action",
        //   render: (text: any, record: { key: any; }) =>
        //     this.state.rows.length >= 1 ? (
        //       <Popconfirm
        //         title="Sure to delete?"
        //         onConfirm={() => this.handleDelete(record.key)}
        //       >
        //         <Icon
        //           type="delete"
        //           theme="filled"
        //           style={{ color: "red", fontSize: "20px" }}
        //         />
        //       </Popconfirm>
        //     ) : null
        // }
      ]
    };
  }

  handleSave = (row: { key: any; }) => {
    const newData = [...this.state.rows];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ rows: newData });
  };

  checkFile(file: any) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
  }

  fileHandler = (fileList: any) => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!"
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      this.setState({
        errorMessage: "Unknown file format. Only Excel files are uploaded!"
      });
      return false;
    }

    // try {
        var reader = new FileReader();
        reader.onload = function(fileObj) {
            const arrayBuffer: ArrayBuffer = fileObj.target.result as ArrayBuffer;
            var data = new Uint8Array(arrayBuffer);
            var wb = read(data, {type: 'array', WTF: true});
            console.log(JSON.stringify(wb));
            var sheet = wb.SheetNames[0];
            console.log(sheet);
            var worksheet = wb.Sheets[sheet];
            console.log(worksheet);

            var jsonData = utils.sheet_to_json<JSON>(worksheet);
            
            var groupProjectID = InsertStudents(jsonData);
            console.log(groupProjectID);

        };
        const fileName = fileObj.name;
        console.log(fileName);
        reader.readAsArrayBuffer(fileObj);

        let newRows: { firstName: any; lastName: any;}[] = [];
        this.state.rows.slice(1).map((row: string | any[], index: any) => {
          if (row && row !== "undefined") {
            newRows.push({
              firstName: row[0],
              lastName: row[1],
            });
          }
        });
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!"
          });
          return false;
        } else {
          this.setState({
            cols: this.state.cols,
            rows: newRows,
            errorMessage: null
          });
        }
        //just pass the fileObj as parameter
        // ExcelRenderer(fileObj, (err: any, resp: { rows: any[]; cols: any; }) => {
        //   if (err) {
        //     console.log(err);
        //   } else {
        //     let newRows: { key: any; name: any; age: any; gender: any; }[] = [];
        //     resp.rows.slice(1).map((row: string | any[], index: any) => {
        //       if (row && row !== "undefined") {
        //         newRows.push({
        //           key: index,
        //           name: row[0],
        //           age: row[1],
        //           gender: row[2]
        //         });
        //       }
        //     });
        //     if (newRows.length === 0) {
        //       this.setState({
        //         errorMessage: "No data found in file!"
        //       });
        //       return false;
        //     } else {
        //       this.setState({
        //         cols: resp.cols,
        //         rows: newRows,
        //         errorMessage: null
        //       });
        //     }
        //   }
        // });
        return false;
    // } catch (error) {
    //     this.setState({
    //         errorMessage: error
    //       });  
    //       console.log(error);
    // }
  };

  handleSubmit = async () => {
    console.log("submitting: ", this.state.rows);
    //submit to API
    //if successful, banigate and clear the data
    //this.setState({ rows: [] })
  };

  handleDelete = (key: any) => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { rows } = this.state;
    const newData = {
      firstname: "-",
      lastname: "-"
    };
    this.setState({
      rows: [newData, ...rows],
      //count: count + 1
    });
  };

  render() {
    const components = {
      body: {
        row: <tr />,
        cell: <td> </td>
      }
    };
    const columns = this.state.columns.map((col: { editable: any; dataIndex: any; title: any; }) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });

    return (
      <>
        <h1>Importing Excel Component</h1>
        <Row gutter={16}>
          <Col
            span={8}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5%"
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="page-title">Upload User Data</div>
            </div>
            <div>{this.state.errorMessage}</div>
          </Col>
          {/* <Col span={8}>
            <a
              href="https://res.cloudinary.com/bryta/raw/upload/v1562751445/Sample_Excel_Sheet_muxx6s.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              Sample excel sheet
            </a>
          </Col>*/}
          <Col
            span={8}
            //align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {this.state.rows.length > 0 && (
              <>
                <Button
                  onClick={this.handleAdd}
                  size="large"
                  //type="info"
                  style={{ marginBottom: 16 }}
                >
                  <PlusOutlined/>
                  Add a row
                </Button>{" "}
                <Button
                  onClick={this.handleSubmit}
                  size="large"
                  type="primary"
                  style={{ marginBottom: 16, marginLeft: 10 }}
                >
                  Submit Data
                </Button>
              </>
            )}
          </Col> 
        </Row>
        <div>
          <Upload
            name="file"
            beforeUpload={this.fileHandler}
            onRemove={() => this.setState({ rows: [] })}
            multiple={false}
          >
            <Button type="primary">
               <UploadOutlined/>  Click to Upload Excel File
            </Button>
          </Upload>
        </div>
        <div style={{ marginTop: 20 }}>
          <Table
            //components={components}
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />
        </div>
      </>
    );
  }
}
