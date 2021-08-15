using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class StudentGroupSolution
    {
        public int StudentGroupId { get; set; }
        public int GroupSolutionId { get; set; }
        public int StudentId { get; set; }
        public int GroupNumber { get; set; }

        public virtual GroupSolution GroupSolution { get; set; }
        public virtual Student Student { get; set; }
    }
}
