using GroupUp.Models;
using Core;
using Google.OrTools.ConstraintSolver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GroupUp
{
    public class AssignmentService
    {
        private List<Student> studentsOriginal;
        private List<StudentChoice> studentChoices;
        private List<StudentExclude> studentExclusions;
        public long time;
        private static int SEC_TO_MS = 1000;
        public AssignmentService()
        {
        }

        public void InsertStudents(List<Student> students)
        {
            this.studentsOriginal = students;
        }

        public void InsertStudentChoices(List<StudentChoice> studentChoices)
        {
            this.studentChoices = studentChoices;
        }

        public void InsertStudentExclusions(List<StudentExclude> studentExclusions)
        {
            this.studentExclusions = studentExclusions;
        }

        public List<Student> RandomiseStudents()
        {
            var rnd = new Random();
            return studentsOriginal.OrderBy(student => rnd.Next()).ToList();
        }

        public List<GroupSolution> GetGroupSolutions(GroupConfig groupConfig)
        {
            List<GroupSolution> groupSolutions = new List<GroupSolution>();
            List<Student> studentsRandomised = this.studentsOriginal;

                for (int i = 0; i < groupConfig.numSolutions; i++)
                {
                    if (i != 0) { studentsRandomised = RandomiseStudents(); }
                    var solution = AssignGroups(studentsRandomised, groupConfig);
                    if (solution.groups.Count > 0)
                    {
                        groupSolutions.Add(solution);
                    }
                }
            return groupSolutions;
        }
        

        public GroupSolution AssignGroups(List<Student> students, GroupConfig groupConfig)
        {
            int groupSize = groupConfig.groupSize;

            Solver solver = new Solver("GroupAssignment");

            int numStudents = students.Count;
            int numGroups = numStudents / groupSize;
            int remainder = numStudents % groupSize;
            IntVar[] studentGroups = solver.MakeIntVarArray(numStudents, 0, numGroups, "students");

            // group size must be as equal as possible
            IntVar[] gcc = solver.MakeIntVarArray(numGroups, groupSize + (remainder / numGroups), groupSize + 1 + (remainder / numGroups), "gcc");
            solver.Add(studentGroups.Distribute(gcc));

            IntVar[] num_preferences = new IntVar[numStudents];
            // Students must be given at least one of their preferences
            for (int i = 0; i < numStudents; i++)
            {
                ICollection<StudentChoice> preferences = studentChoices.FindAll(x => x.ChooserStudentId == students[i].id);
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
                                              select (studentGroups[i] == studentGroups[j])
                                            ).ToArray().Sum();

                    //Soft Constraint. Students should have at least one preference.
                    // If there are not enough constraints, the process takes too long.
                    IntVar pref = (num_preference.Var() > 0).Var();
                    num_preferences[i] = (pref * (num_preference.Var() - 1 + 1000)).Var();

                    solver.Add(num_preference >= groupConfig.numChoice);

                }
            }
            //Soft Constraint. Students should have at least one preference.
            IntVar sum_preferences = solver.MakeSum(num_preferences).VarWithName("sum");

            // Certain students cannot be in the same group
            ICollection<StudentExclude> exclusions = studentExclusions;
            foreach (StudentExclude exclusion in exclusions)
            {
                int firstIndex = students.FindIndex(x => x.id == exclusion.FirstStudentId);
                int secondIndex = students.FindIndex(x => x.id == exclusion.SecondStudentId);
                solver.Add(studentGroups[firstIndex] != studentGroups[secondIndex]);
            }

            // Symmetry breaking
            for (int s = 0; s < numGroups; s++)
            {
                solver.Add(studentGroups[s] <= s);
            }

            OptimizeVar opt = solver.MakeMaximize(sum_preferences, 1);

            DecisionBuilder db = solver.MakePhase(studentGroups,
                                                    Solver.CHOOSE_PATH,
                                                    Solver.ASSIGN_MIN_VALUE);

            // Time limit
            int timeLimit = groupConfig.maxTime / groupConfig.numSolutions * SEC_TO_MS;

            solver.NewSearch(db, opt, solver.MakeTimeLimit(timeLimit));

            int sol = 0;
            GroupSolution solution = new GroupSolution(numGroups);

            while (solver.NextSolution() && sol < (groupConfig.maxTime / 3))
            {
                Console.Error.WriteLine("value: " + sum_preferences.Value());

                    solution.initGroups(numGroups);
                    for (int i = 0; i < numStudents; i++)
                    {
                        Group group = solution.groups[(int)studentGroups[i].Value()];
                        group.studentNames.Add(students[i].firstName + " " + students[i].lastName);
                        group.studentIds.Add(students[i].id);
                    }
                
                sol++;
            }
            Console.Error.WriteLine("Solutions: " + solver.Solutions());
            Console.Error.WriteLine("Time: "  + solver.WallTime());
            Console.Error.WriteLine("Branches " + solver.Branches());
            Console.Error.WriteLine("Failures: " + solver.Failures());
            solver.EndSearch();

            return solution;
        }
    }

}
