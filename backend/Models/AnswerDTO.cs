namespace prid_2425_f06.Models;

public class AnswerDTO {
    public int InstanceId { get; set; } = 0;
   // public InstanceDTO Instance { get; set; } = null!; 
    public int QuestionId { get; set; } = 0;
    public int Idx { get; set; } = 0;
    public string Value { get; set; } = "";
    
    
}

public class AnswerWithInstanceDto : AnswerDTO
{ 
    public InstanceDTO Instance { get; set; } 
}
