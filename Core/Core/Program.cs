using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using ElectronCgi.DotNet;

namespace AssignmentProblem
{
    public class Program
    {

        private static APIController controller;
        public static void Main(string[] args)
        {
            controller = new APIController();
            controller.APICalls();
        }
    }
}
