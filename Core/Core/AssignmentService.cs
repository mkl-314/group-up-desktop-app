using System;
using System.Linq;
using Google.OrTools.ConstraintSolver;
using System.Collections.Generic;
using AssignmentProblem.Models;
using Core;

namespace AssignmentProblem
{
    public class AssignmentService
    {
        private List<Student> students;
        private List<StudentChoice> studentChoices;
        private List<StudentExclude> studentExclusions;
        public long time;

        public AssignmentService()
        {
        }

        public void InsertStudents(List<Student> students)
        {
            this.students = students;
        }

        public void InsertStudentChoices(List<StudentChoice> studentChoices)
        {
            this.studentChoices = studentChoices;
        }

        public void InsertStudentExclusions(List<StudentExclude> studentExclusions)
        {
            this.studentExclusions = studentExclusions;
        }

        public void RandomiseStudents()
        {
            var rnd = new Random();
            this.students = students.OrderBy(student => rnd.Next()).ToList();
        }

        public List<GroupSolution> GetGroupSolutions(GroupConfig groupConfig)
        {
            List<GroupSolution> groupSolutions = new List<GroupSolution>();
            for (int i=0; i<groupConfig.numSolutions; i++)
            {
                if (i != 0) { RandomiseStudents();}
                var solution = AssignGroups1(groupConfig.groupSize);
                if (solution.groups.Count > 0)
                {
                    groupSolutions.Add(solution);
                }
            }
            return groupSolutions;
        }

        public GroupSolution AssignGroups1(int groupSize)
        {
            Solver solver = new Solver("GroupAssignment");

            int num_students = students.Count;
            int num_groups = num_students / groupSize;
            int remainder = num_students % groupSize;
            IntVar[] student_groups = solver.MakeIntVarArray(num_students, 0, num_groups, "students");

            // group size must be as equal as possible
            IntVar[] gcc = solver.MakeIntVarArray(num_groups, groupSize + (remainder / num_groups), groupSize + 1 + (remainder / num_groups), "gcc");
            solver.Add(student_groups.Distribute(gcc));
            
            IntVar[] num_preferences = new IntVar[num_students];
            // Students must be given at least one of their preferences
            for (int i = 0; i < num_students; i++)
            {
                ICollection<StudentChoice> preferences = studentChoices.FindAll(x => x.ChooserStudentId == students[i].id );
                int[] preferenceIndexes = new int[preferences.Count()];
                int count = 0;
                foreach (StudentChoice preference in preferences)
                {
                    preferenceIndexes[count] = students.FindIndex(x => x.id == preference.ChosenStudentId);
                    count++;
                }

                num_preferences[i] = solver.MakeIntConst(0, "none");
                // Let students have at least one preference
                if (preferences.Count() > 0)
                {
                    IntExpr num_preference = (from j in preferenceIndexes
                                              select (student_groups[i] == student_groups[j])
                                            ).ToArray().Sum();
                    if (num_preference >= 1)
                    {
                        num_preferences[i] = (num_preference.Var() - 1 + 1000).Var();
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
                ICollection<StudentExclude> exclusions = studentExclusions; 
                foreach (StudentExclude exclusion in exclusions)
                {
                    int firstIndex = students.FindIndex(x => x.id == exclusion.FirstStudentId);
                    int secondIndex = students.FindIndex(x => x.id == exclusion.SecondStudentId);
                    solver.Add(student_groups[firstIndex] != student_groups[secondIndex]);
                }
            }

            // Symmetry breaking
            for (int s = 0; s < groupSize; s++)
            {
                solver.Add(student_groups[s] <= s);
            }

            OptimizeVar opt = solver.MakeMaximize(sum_preferences, 1);

            DecisionBuilder db = solver.MakePhase(student_groups,
                                                    Solver.CHOOSE_PATH,
                                                    Solver.ASSIGN_MIN_VALUE);

            // Time limit
            int THIRTY_S_IN_MS = 30000;

            solver.NewSearch(db, solver.MakeTimeLimit(THIRTY_S_IN_MS));

            int sol = 0;
            GroupSolution solution = new GroupSolution();

            while (solver.NextSolution() && sol <= 0)
            {
                for (int i = 1; i <= num_groups; i++)
                {
                    solution.groups.Add(new Group
                    {
                        groupNumber = i,
                        studentNames = new List<string>(),
                        studentIds = new List<int>()
                    });
                }

                for (int i = 0; i < num_students; i++)
                {
                    Group group = solution.groups[(int)student_groups[i].Value()];
                    group.studentNames.Add(students[i].firstName + " " + students[i].lastName);
                    group.studentIds.Add(students[i].id);
                }

                sol++;
            }

            solver.EndSearch();

            return solution;
        }
    }

}
