using System;
using System.Linq;
using Google.OrTools.ConstraintSolver;
using System.Collections.Generic;
using AssignmentProblem.Models;
using Microsoft.EntityFrameworkCore;

namespace AssignmentProblem
{
    public class AssignmentService
    {
        private GroupUpContext _context;
        public AssignmentService(GroupUpContext context)
        {
            _context = context;
        }

        public List<Student> GetStudents(int groupProjectID)
        {
            DbSet<Student> dbStudent = _context.Students;

            // Note: cannot return student.ToList() as a circular reference occurs so the program never stops loading
            IQueryable<Student> studentsQ = dbStudent.Where(x => groupProjectID == x.GroupProjectId)
                .Include(x => x.StudentChoiceChooserStudents)
                .Include(x => x.StudentExcludeFirstStudents)
                .OrderBy(x => x.StudentId);

            return studentsQ.ToList();
        } 
        public List<Group> AssignGroups(int groupProjectID, int group_size)
        {
            List<Student> students = GetStudents(groupProjectID);

            Solver solver = new Solver("GroupAssignment");

            int num_students = students.Count();
            int num_groups = num_students / group_size;

            IntVar[] student_groups = solver.MakeIntVarArray(num_students, 0, num_groups, "students");

            // group size must be group_size or group_size+1
            IntVar[] gcc = solver.MakeIntVarArray(num_groups, group_size, group_size + 2, "gcc");
            solver.Add(student_groups.Distribute(gcc));

            IntVar[] num_preferences = new IntVar[num_students];
            // Students must be given at least one of their preferences
            for (int i=0; i< num_students; i++)
            {
                ICollection<StudentChoice> preferences = students[i].StudentChoiceChooserStudents;
                int[] preferenceIndexes = new int[preferences.Count()];
                int count = 0;
                foreach (StudentChoice preference in preferences)
                {
                    preferenceIndexes[count] = students.FindIndex(x => x.StudentId == preference.ChosenStudentId); 
                    count++;
                }

                num_preferences[i] = solver.MakeIntConst(0, "none");
                // Let students have at least one preference
                if (preferences.Count() > 0)
                {
                    IntExpr num_preference = (from j in preferenceIndexes
                                                      //where i != j  // users cannot choose themselves. Can probably remove later
                                                      select (student_groups[i] == student_groups[j])
                                            ).ToArray().Sum();
                    if (num_preference >= 1)
                    {
                        num_preferences[i] = (num_preference.Var() + num_students * num_students).Var();
                    } 

                    // Hard Constraint. Comment out if using soft constraint - not working yet
                    solver.Add(num_preference >= 1);
                }
            }
            //Soft Constraint. Students should have at least one preference.
            IntVar sum_preferences = solver.MakeSum(num_preferences).VarWithName("sum");

            // Certain students cannot be in the same group
            foreach (Student student in students)
            {
                ICollection<StudentExclude> exclusions = student.StudentExcludeFirstStudents;
                foreach (StudentExclude exclusion in exclusions)
                {
                    int firstIndex = students.FindIndex(x => x.StudentId == exclusion.FirstStudentId);
                    int secondIndex = students.FindIndex(x => x.StudentId == exclusion.SecondStudentId);
                    solver.Add(student_groups[firstIndex] != student_groups[secondIndex]);
                }

            }

            // Symmetry breaking
            for (int s = 0; s < group_size; s++)
            {
                solver.Add(student_groups[s] <= s);
            }

            OptimizeVar opt = solver.MakeMaximize(sum_preferences,1);
            // Search
            DecisionBuilder db = solver.MakePhase(student_groups,
                                                  Solver.CHOOSE_PATH,
                                                  Solver.ASSIGN_MIN_VALUE);

            solver.NewSearch(db, opt);
            //solver.NewSearch(db);
            int sol = 0;
            List<Group> groups = new List<Group>();
            for (int i=0; i<num_groups; i++)
            {
                groups.Add(new Group
                {
                    students_name = new List<String>(),
                    student_id = new List<int>()
                }); ;
            }

            while (solver.NextSolution() && sol<=0)
            {

                //Console.Write("x " + sol + ": ");
                for (int i = 0; i < num_students; i++)
                {
                    //Console.Write("{0} ", student_groups[i].Value());
                    if (sol == 0)
                    {
                        Group group = groups[(int)student_groups[i].Value()];
                        group.students_name.Add(students[i].FirstName + " " + students[i].LastName);
                        group.student_id.Add(students[i].StudentId);
                    }
                }
  
                //Console.WriteLine();
                sol++;
            }

            //Console.WriteLine("\nSolutions: {0}", solver.Solutions());
            //Console.WriteLine("WallTime: {0}ms", solver.WallTime());
            //Console.WriteLine("Failures: {0}", solver.Failures());
            //Console.WriteLine("Branches: {0} ", solver.Branches());

            solver.EndSearch();
            return groups;
        }

        public int SaveGroupProject(string name)
        {
            return 1;
        }
        public void SaveGroups(List<Group> groups, int groupProjectID, int groupSize)
        {
            GroupSolution groupSolution = new GroupSolution()
            {
                GroupProjectId = groupProjectID,
                GroupSize = groupSize
            };

            _context.GroupSolutions.Add(groupSolution);
            _context.SaveChanges();

            for (int i=0;i<groups.Count;i++)
            {
                Group group = groups[i];

                for (int j = 0; j < group.student_id.Count; j++)
                {
                    GroupSolutionStudent gss = new GroupSolutionStudent()
                    {
                        GroupSolutionId = groupSolution.GroupSolutionId,
                        StudentId = group.student_id[j],
                        GroupNumber = i
                    };
                    
                    _context.GroupSolutionStudents.Add(gss);
                }  
            }
            _context.SaveChanges();

        }
    }

}
