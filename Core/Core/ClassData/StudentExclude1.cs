using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class StudentExclude1
    {
        public int StudentExcludeId { get; set; }
        public int FirstStudentId { get; set; }
        public int SecondStudentId { get; set; }

        //public string FirstStudent { get; set; }
        //public string SecondStudent { get; set; }

        public virtual Student1 FirstStudent { get; set; }
        public virtual Student1 SecondStudent { get; set; }
    }
}
