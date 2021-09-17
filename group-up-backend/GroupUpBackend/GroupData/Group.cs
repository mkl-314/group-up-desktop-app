using System.Collections.Generic;

namespace GroupUp
{
    public class Group
    {
        public int groupNumber { get; set; }

        public List<string> studentNames { get; set; }

        public List<int> studentIds { get; set; }
        public Group()
        {
            studentNames = new List<string>();
            studentIds = new List<int>();
        }
    }
}
