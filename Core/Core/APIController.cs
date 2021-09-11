using AssignmentProblem.Models;
using Core;
using ElectronCgi.DotNet;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AssignmentProblem
{
    public class APIController
    {

        private readonly AssignmentService _assignmentService;

        private Connection connection;
        public APIController()
        {
            _assignmentService = new AssignmentService();
        }

        public void ApiCalls()
        {
            connection = new ConnectionBuilder()
                .WithLogging("Log.txt")
                .Build();

            GetGroups();
            InsertStudents();
            InsertStudentChoices();
            InsertStudentExclusions();

            connection.Listen();
        }
        public void GetGroups()
        {
            connection.On<GroupConfig, IActionResult>("GetGroups", groupConfig =>
             {
                 try
                 {

                     List<GroupSolution> solutions = _assignmentService.GetGroupSolutions(groupConfig);
                     if (solutions.Count > 0)
                     {
                         return new OkObjectResult(solutions);
                     }
                     else
                     {
                         return new BadRequestObjectResult("Request timed out. Potentially no solutions.");
                     }
                 }
                 catch (Exception ex)
                 {
                     return new BadRequestObjectResult(ex.Message);
                 }
             });
        }

        public void InsertStudents()
        {
            connection.On<List<Student>, IActionResult>("InsertStudents", studentData =>
            {
                try
                {
                    _assignmentService.InsertStudents(studentData);
                    return new OkObjectResult(true);
                }
                catch (Exception ex)
                {
                    return new BadRequestObjectResult(ex.Message);
                }
            });
        }

        public void InsertStudentChoices()
        {
            connection.On<List<StudentChoice>, IActionResult>("InsertStudentChoices", studentData =>
            {
                try
                {
                    _assignmentService.InsertStudentChoices(studentData);
                    return new OkObjectResult(true);
                }
                catch (Exception ex)
                {
                    return new BadRequestObjectResult(ex.Message);
                }
            });
        }

        public void InsertStudentExclusions()
        {
            connection.On<List<StudentExclude>, IActionResult>("InsertStudentExclusions", studentData =>
            {
                try
                {
                    _assignmentService.InsertStudentExclusions(studentData);
                    return new OkObjectResult(true);
                }
                catch (Exception ex)
                {
                    return new BadRequestObjectResult(ex.Message);
                }
            });
        }
    }
}
