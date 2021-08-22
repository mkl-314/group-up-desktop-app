using System;
using System.Linq;
using Google.OrTools.ConstraintSolver;
using System.Collections.Generic;
using AssignmentProblem.Models;
using Microsoft.EntityFrameworkCore;
using Core;

namespace AssignmentProblem
{
    public class AssignmentService
    {
        private List<Student1> students;
        private List<StudentChoice1> studentChoices;
        private List<StudentExclude1> studentExclusions;
        public long time;

        private int numSolutions = 0;
        public AssignmentService()
        {
        }

        public void InsertStudents(List<Student1> students)
        {
            this.students = students;
        }

        public void InsertStudentChoices(List<StudentChoice1> studentChoices)
        {
            this.studentChoices = studentChoices;
        }

        public void InsertStudentExclusions(List<StudentExclude1> studentExclusions)
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
                ICollection<StudentChoice1> preferences = studentChoices.FindAll(x => x.ChooserStudentId == students[i].id );
                int[] preferenceIndexes = new int[preferences.Count()];
                int count = 0;
                foreach (StudentChoice1 preference in preferences)
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
                        num_preferences[i] = (num_preference.Var() + num_students * num_students).Var();
                    }

                    // Hard Constraint. Comment out if using soft constraint - not working yet
                    solver.Add(num_preference >= 1);
                }
            }
            //Soft Constraint. Students should have at least one preference.
            IntVar sum_preferences = solver.MakeSum(num_preferences).VarWithName("sum");
            
            // Certain students cannot be in the same group
            foreach (Student1 student in students)
            {
                ICollection<StudentExclude1> exclusions = studentExclusions; 
                foreach (StudentExclude1 exclusion in exclusions)
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
            // Search
            int[] solutionOptions = new int[] { Solver.CHOOSE_PATH, /*Solver.CHOOSE_FIRST_UNBOUND*/ };

            DecisionBuilder db = solver.MakePhase(student_groups,
                                                    Solver.CHOOSE_PATH,
                                                    Solver.ASSIGN_MIN_VALUE);

            //solver.NewSearch(db, opt);
            // Time limit
            int THIRTY_S_IN_MS = 30000;
            solver.NewSearch(db, solver.MakeTimeLimit(THIRTY_S_IN_MS));
            int sol = 0;
            GroupSolution solution = new GroupSolution();

            Console.Error.WriteLine("Solving:");
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

                Console.Error.Write("x " + sol + ": ");
                for (int i = 0; i < num_students; i++)
                {
                    Console.Error.Write("{0} ", student_groups[i].Value());
                    
                    Group group = solution.groups[(int)student_groups[i].Value()];
                    group.studentNames.Add(students[i].firstName + " " + students[i].lastName);
                    group.studentIds.Add(students[i].id);
                }

                Console.Error.WriteLine();
                sol++;
                numSolutions++;
            }

            //Console.WriteLine("\nSolutions: {0}", solver.Solutions());
            //Console.WriteLine("WallTime: {0}ms", solver.WallTime());
            //Console.WriteLine("Failures: {0}", solver.Failures());
            //Console.WriteLine("Branches: {0} ", solver.Branches());

            Console.Error.Write(solver.WallTime());
            solver.EndSearch();

            return solution;
        }
    }

}
