namespace GroupUp.Models
{
    public partial class StudentChoice
    {
        public int StudentChoiceId { get; set; }

        public int ChooserStudentId { get; set; }
        public int ChosenStudentId { get; set; }
    }
}
