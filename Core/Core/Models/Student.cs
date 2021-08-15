using System;
using System.Collections.Generic;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class Student
    {
        public Student()
        {
            GroupSolutionStudents = new HashSet<GroupSolutionStudent>();
            StudentChoiceChooserStudents = new HashSet<StudentChoice>();
            StudentChoiceChosenStudents = new HashSet<StudentChoice>();
            StudentExcludeFirstStudents = new HashSet<StudentExclude>();
            StudentExcludeSecondStudents = new HashSet<StudentExclude>();
        }

        public int StudentId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public int GroupProjectId { get; set; }

        public virtual GroupProject GroupProject { get; set; }
        public virtual ICollection<GroupSolutionStudent> GroupSolutionStudents { get; set; }
        public virtual ICollection<StudentChoice> StudentChoiceChooserStudents { get; set; }
        public virtual ICollection<StudentChoice> StudentChoiceChosenStudents { get; set; }
        public virtual ICollection<StudentExclude> StudentExcludeFirstStudents { get; set; }
        public virtual ICollection<StudentExclude> StudentExcludeSecondStudents { get; set; }
    }
}
