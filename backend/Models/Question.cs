using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace prid_2425_f06.Models;

public enum QuestionType{
    Short = 1, Long = 2, Date = 3, Email = 4, Integer = 5, Check = 6, Combo = 7, Radio = 8
}

    public class Question {
        private readonly FormContext? _context;
        public Question(FormContext context) {
            this._context = context;
        }
        public Question() {}
        [Key]
        public int Id { get; set; }
        [ForeignKey(nameof(Form))]
        public int FormId { get; set; } = 0;
        
        public int Idx { get; set; } = 0;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public QuestionType Type { get; set; } = QuestionType.Short;
        public bool Required { get; set; } = false;
         [ForeignKey(nameof(OptionList))]
        public int? OptionListId { get; set; }
        public OptionList? OptionList { get; set; }
    

        public ICollection<Answer> Answers  {get; set;} = new HashSet<Answer>();
       // public ICollection<OptionList> Options {get; set; } = new HashSet<OptionList>();  
        
    }
