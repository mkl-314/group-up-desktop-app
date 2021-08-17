using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class Student1
    {
        public Student1()
        {
            GroupSolutionStudents = new HashSet<GroupSolutionStudent>();
            StudentChoiceChooserStudents = new HashSet<StudentChoice1>();
            StudentChoiceChosenStudents = new HashSet<StudentChoice1>();
            StudentExcludeFirstStudents = new HashSet<StudentExclude1>();
            StudentExcludeSecondStudents = new HashSet<StudentExclude1>();
        }

        public int StudentId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public int GroupProjectId { get; set; }

        public virtual GroupProject GroupProject { get; set; }
        public virtual ICollection<GroupSolutionStudent> GroupSolutionStudents { get; set; }
        public virtual ICollection<StudentChoice1> StudentChoiceChooserStudents { get; set; }
        public virtual ICollection<StudentChoice1> StudentChoiceChosenStudents { get; set; }
        public virtual ICollection<StudentExclude1> StudentExcludeFirstStudents { get; set; }
        public virtual ICollection<StudentExclude1> StudentExcludeSecondStudents { get; set; }
    }
}
