using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class GroupProject
    {
        public GroupProject()
        {
            Students = new HashSet<Student>();
        }

        public int GroupProjectId { get; set; }
        public string GroupProjectName { get; set; }
        public DateTime? DateCreated { get; set; }

        public virtual ICollection<Student> Students { get; set; }
    }
}
