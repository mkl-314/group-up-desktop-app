using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class StudentChoice1
    {
        public int StudentChoiceId { get; set; }
        public int ChooserStudentId { get; set; }
        public int ChosenStudentId { get; set; }

        public virtual Student1 ChooserStudent { get; set; }
        public virtual Student1 ChosenStudent { get; set; }
    }
}
