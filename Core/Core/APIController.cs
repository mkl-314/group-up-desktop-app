using AssignmentProblem.Models;
using ElectronCgi.DotNet;
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
            connection.Listen();
        }
        public void GetGroups()
        {
            connection.On<int, List<Group>>("GetGroups", groupSize =>
            {
                return _assignmentService.AssignGroups(1, groupSize);
            });

        }

        public void InsertStudents()
        {
            connection.On<List<Student>, int>("InsertStudents", studentData =>
            {
                return 1;
            });
        }
        public void Listen()
        {
            connection.Listen();
        }
    }
}
