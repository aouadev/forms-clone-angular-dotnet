namespace prid_2425_f06.Models;


public class FormDTO {

    public int FormId { get; set;}
    public string Title { get; set;} = null!;
    public string? Description { get; set;}
    public int OwnerId { get; set; }
    public bool IsPublic { get; set; } = false;
}