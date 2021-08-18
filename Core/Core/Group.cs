using AssignmentProblem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AssignmentProblem
{
    public class Group
    {
        public int groupNumber { get; set; }

        public List<string> studentNames { get; set; }

        public List<int> studentIds { get; set; }
        public Group()
        {

        }
    }
}
