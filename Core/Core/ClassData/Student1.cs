using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class Student1
    {
        public Student1()
        {
 
        }

        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }

        //public virtual GroupProject GroupProject { get; set; }
        //public virtual ICollection<GroupSolutionStudent> GroupSolutionStudents { get; set; }
        //public virtual ICollection<StudentChoice1> StudentChoiceChooserStudents { get; set; }
        //public virtual ICollection<StudentChoice1> StudentChoiceChosenStudents { get; set; }
        //public virtual ICollection<StudentExclude1> StudentExcludeFirstStudents { get; set; }
        //public virtual ICollection<StudentExclude1> StudentExcludeSecondStudents { get; set; }
    }
}
