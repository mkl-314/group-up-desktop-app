import { Button } from "antd";
import * as React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { WorkSheet } from "xlsx";
import { ExportGroup, GroupSolution } from "../types/Groups";

export const ExportGroups = ({ groupSolutions: groupSolutions }: any) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToXLSX = (groupSolutions: GroupSolution[]) => {
    const exportSolutions = convertSolutionsForExport(groupSolutions);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    console.log(exportSolutions);
    var numSol: number = 1;
    for (var solution of exportSolutions) {
      const ws: WorkSheet = XLSX.utils.json_to_sheet(solution);
      XLSX.utils.book_append_sheet(wb, ws, `Solution ${numSol}`);
      numSol++;
    }
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(data, "Group Up" + fileExtension);
  };

  function convertSolutionsForExport(groupSolutions: GroupSolution[]) {
    var exportSolutions = [];
    for (var solution of groupSolutions) {
      var exportSolution: ExportGroup[] = [];
      for (var groups of solution.groups) {
        for (var student of groups.studentNames) {
          exportSolution.push({
            "Group Number": groups.groupNumber,
            "Student Name": student,
          });
        }
        exportSolution.push({
          "Group Number": "",
          "Student Name": "",
        });
      }
      exportSolutions.push(exportSolution);
    }
    return exportSolutions;
  }

  return (
    <Button className="btn constant-width container" onClick={(e) => exportToXLSX(groupSolutions)}>
      Export Groups
    </Button>
  );
};
