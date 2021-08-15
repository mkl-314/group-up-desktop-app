using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class GroupSolution
    {
        public GroupSolution()
        {
            GroupSolutionStudents = new HashSet<GroupSolutionStudent>();
        }

        public int GroupSolutionId { get; set; }
        public int GroupProjectId { get; set; }
        public int GroupSize { get; set; }

        public virtual ICollection<GroupSolutionStudent> GroupSolutionStudents { get; set; }
    }
}
