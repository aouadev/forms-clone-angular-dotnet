namespace prid_2425_f06.Models;

public class QuestionDTO {
        public int Id { get; set; }
        public int FormId { get; set; } = 0;
        public int Idx { get; set; } = 0;
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public QuestionType Type { get; set; } = QuestionType.Short;
        public bool Required { get; set; } = false;
        public int? OptionListId { get; set; }
       // public OptionListDTO? OptionList { get; set; }
      
        
}
public class QuestionWithOptionListDetailsDto : QuestionDTO {
    public OptionListWithOptionValuesDto? OptionList { get; set; }
}

/*public class QuestionWithOLDetailsDTO : QuestionDTO {
    public OptionListWithValuesDTO OL { get; set; } = null!;
}*/

public class QuestionWithAnswersDTO() : QuestionWithOptionListDetailsDto {
    public ICollection<AnswerDTO> Answers { get; set; } = new HashSet<AnswerDTO>();
   // public ICollection<OptionListDTO> Options { get; set; } = new HashSet<OptionListDTO>();
}
