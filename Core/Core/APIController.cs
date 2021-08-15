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

            connection = new ConnectionBuilder()
            .WithLogging()
            .Build();
        }

        public void APICalls()
        {
            GetGroups();
            connection.On<string, string>("greeting", name => "Hello " + name);
        }
        public void GetGroups()
        {
            connection.On<string, Group>("GetGroups", groupSize =>
            {
                return null;
            });
            connection.Listen();

        }

        public void Listen()
        {
            connection.Listen();
        }
    }
}
