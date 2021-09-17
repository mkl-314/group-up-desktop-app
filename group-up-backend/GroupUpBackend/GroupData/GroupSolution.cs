using GroupUp;
using System.Collections.Generic;

namespace Core
{
    public class GroupSolution
    {
        public List<Group> groups { get; set; }
        public GroupSolution(int numGroups)
        {
            groups = new List<Group>();
        }

        public void initGroups(int numGroups)
        {
            groups.Clear();
            for (int i = 1; i <= numGroups; i++)
            {
                groups.Add(new Group
                {
                    groupNumber = i,
                });
            }
        }
    }
}
