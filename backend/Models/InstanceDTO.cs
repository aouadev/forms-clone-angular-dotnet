namespace prid_2425_f06.Models;

public class InstanceDTO {
    public int InstanceId { get; set; }
    public DateTimeOffset Started { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? Completed { get; set; }
}
public class InstanceWithFormDetailedDTO : InstanceDTO {
    public FormWithQuestionAndAnswersDTO? Form { get; set; }
}


/*public class InstanceWithQuestionsDetailsDTO {
    public ICollection<QuestionWithOLDetailsDTO> QuestionsDTO {get; set;}= new HashSet<QuestionWithOLDetailsDTO>();    
}

public class IstanceWithQuestionsAndAnswersDTO : InstanceWithQuestionsDetailsDTO {
    public ICollection<AnswerDTO> AnswersDTO {get; set;} = new HashSet<AnswerDTO>();
}*/