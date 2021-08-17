using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class GroupSolutionStudent
    {
        public int GroupSolutionStudentId { get; set; }
        public int GroupSolutionId { get; set; }
        public int StudentId { get; set; }
        public int GroupNumber { get; set; }

        public virtual GroupSolution GroupSolution { get; set; }
        public virtual Student1 Student { get; set; }
    }
}
