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
            //CreateHostBuilder(args).Build().Run();

            controller = new APIController();
            controller.APICalls();

            var connection = new ConnectionBuilder()
                .WithLogging()
                .Build();

            connection.On<string, string>("greeting", name => "Hello " + name);
            //connection.On<string, Group>("GetGroups", name =>
            //{
            //    return null;
            //});
            connection.Listen();
            controller.Listen();
        }

        //public static IHostBuilder CreateHostBuilder(string[] args) =>
        //    Host.CreateDefaultBuilder(args)
        //        .ConfigureWebHostDefaults(webBuilder =>
        //        {
        //            webBuilder.UseStartup<Startup>();
        //        });

    }
}
