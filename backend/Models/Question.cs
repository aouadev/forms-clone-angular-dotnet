using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace prid_2425_f06.Models;

public enum QuestionType{
    Short = 1, Long = 2, Date = 3, Email = 4, Integer = 5, Check = 6, Combo = 7, Radio = 8
}

    public class Question {
        [Key]
        public int Id { get; set; }
        public int Form { get; set; } = 0;
        public int Idx { get; set; } = 0;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public QuestionType Type { get; set; } = null!;
        public bool Required { get; set; } = false;
        public int? OptionList { get; set; }

        public ICollection<Answers> Answers  {get; set;} = new HashSet<Answer>();
        public ICollection<OptionList> Options {get; set; } = new HashSet<OptionList>();  
        
    }
