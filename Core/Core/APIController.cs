using AssignmentProblem.Models;
using ElectronCgi.DotNet;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

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

            connection.Listen();
        }
        public void GetGroups()
        {
            connection.On<string, Group>("GetGroups", groupSize =>
            {
                return null;
            });

        }

        public void Listen()
        {
            connection.Listen();
        }
    }
}
