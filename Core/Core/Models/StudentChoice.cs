using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class StudentChoice
    {
        public int StudentChoiceId { get; set; }
        public int ChooserStudentId { get; set; }
        public int ChosenStudentId { get; set; }

        public virtual Student ChooserStudent { get; set; }
        public virtual Student ChosenStudent { get; set; }
    }
}
