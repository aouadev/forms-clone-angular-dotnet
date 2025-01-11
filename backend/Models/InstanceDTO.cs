namespace prid_2425_f06.Models;

public class InstanceDTO {
    public int InstanceId { get; set; }
     public int FormId { get; set; } 
    public DateTimeOffset Started { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? Completed { get; set; }
    public int UserId { get; set; }
}
public class InstanceWithFormDetailedDTO : InstanceDTO
{
    public FormWithQuestionAndAnswersDTO Form { get; set; } = null!;
}


/*public class InstanceWithQuestionsDetailsDTO {
    public ICollection<QuestionWithOLDetailsDTO> QuestionsDTO {get; set;}= new HashSet<QuestionWithOLDetailsDTO>();    
}

public class IstanceWithQuestionsAndAnswersDTO : InstanceWithQuestionsDetailsDTO {
    public ICollection<AnswerDTO> AnswersDTO {get; set;} = new HashSet<AnswerDTO>();
}*/