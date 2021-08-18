using AssignmentProblem.Models;
using ElectronCgi.DotNet;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace AssignmentProblem
{
    public class APIController
    {

        private GroupUpContext _context;

        private readonly AssignmentService _assignmentService;

        private Connection connection;
        public APIController()
        {
            _context = new GroupUpContext();
            _assignmentService = new AssignmentService(_context);
        }

        public void APICalls()
        {
            connection = new ConnectionBuilder()
                .WithLogging()
                .Build();

            GetGroups();
            connection.On<string, string>("greeting", name => "TEST PLZ WORK " + name);
            InsertStudents();
            InsertStudentChoices();
            InsertStudentExclusions();
            connection.Listen();
        }
        public void GetGroups()
        {
            connection.On<int, List<Group>>("GetGroups", groupSize =>
            {
                return _assignmentService.AssignGroups1(groupSize);
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
        public void Listen()
        {
            connection.Listen();
        }
    }
}
