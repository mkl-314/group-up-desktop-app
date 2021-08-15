using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class StudentExclude
    {
        public int StudentExcludeId { get; set; }
        public int FirstStudentId { get; set; }
        public int SecondStudentId { get; set; }

        public virtual Student FirstStudent { get; set; }
        public virtual Student SecondStudent { get; set; }
    }
}
