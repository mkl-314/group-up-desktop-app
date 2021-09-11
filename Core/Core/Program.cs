namespace AssignmentProblem
{
    public class Program
    {

        private static APIController controller;
        public static void Main(string[] args)
        {
            controller = new APIController();
            controller.ApiCalls();
        }
    }
}
