namespace prid_2425_f06.Models;


public class FormDTO {

    public int FormId { get; set;}
    public string Title { get; set;} = null!;
    public string? Description { get; set;}
 
    public bool IsPublic { get; set; } = false;
}

public class FormWithInstanceDTO : FormDTO {
    public ICollection<InstanceDTO> InstanceDTOs { get; set; } = new HashSet<InstanceDTO>();
}
public class FormWithLastInstanceDTO : FormDTO {
    public InstanceDTO? LastInstance { get; set; }
}
public class FormWithUserDetailsDTO : FormWithLastInstanceDTO{
    public UserDTO Owner { get; set; } = null!;
}
/*public class FormWithQuestionDetailedDTO : FormDTO{
    public ICollection<QuestionWithOLDetailsDTO> QuestionDetails { get; set;} = new HashSet<QuestionWithOLDetailsDTO>();
}*/
public class FormWithQuestionAndAnswersDTO : FormDTO {
    public ICollection<QuestionWithAnswersDTO> Questions { get; set; } = new HashSet<QuestionWithAnswersDTO>();
   // public ICollection<AnswerDTO> Answers { get; set;} = new HashSet<AnswerDTO>();
}

public class FormWithQuestionsDTO : FormWithUserDetailsDTO {
    public ICollection<QuestionDTO> Questions { get; set;} = new HashSet<QuestionDTO>();
}