using AssignmentProblem.Models;
using Core;
using ElectronCgi.DotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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

        public void APICalls()
        {
            connection = new ConnectionBuilder()
                .WithLogging( "log.txt", LogLevel.Information)
                .Build();

            GetGroups();
            InsertStudents();
            InsertStudentChoices();
            InsertStudentExclusions();
            
            connection.Listen();
        }
        public void GetGroups()
        {
            connection.On<GroupConfig,IActionResult>("GetGroups", groupConfig =>
            {
                try
                {

                    List<GroupSolution> solutions = _assignmentService.GetGroupSolutions(groupConfig);
                    if (solutions.Count > 0)
                    {
                        //foreach (Group group in solutions[0].groups)
                        //{
                        //    Console.Error.WriteLine(group.studentNames[0]);
                        //    Console.Error.WriteLine(group.studentNames[1]);
                        //    Console.Error.WriteLine(group.studentNames[2]);
                        //    Console.Error.WriteLine(group.studentNames[3]);
                        //}
                        return new OkObjectResult(solutions);
                    }
                    else
                    {
                        return new BadRequestObjectResult("request timed out. Potentially no solutions.");
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
            connection.On<List<Student1>, IActionResult>("InsertStudents", studentData =>
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
            connection.On<List<StudentChoice1>, IActionResult>("InsertStudentChoices", studentData =>
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
            connection.On<List<StudentExclude1>, IActionResult>("InsertStudentExclusions", studentData =>
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
