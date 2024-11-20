namespace prid_2425_f06.Models;


public class FormDTO {

    public int FormId { get; set;}
    public string Title { get; set;} = null!;
    public string? Description { get; set;}
    public int OwnerId { get; set; }
    public bool IsPublic { get; set; } = false;
}

public class FormWithInstanceDTO : FormDTO {
    public ICollection<InstanceDTO> InstanceDTOs { get; set; } = new HashSet<InstanceDTO>();
}
public class FormWithLastInstanceDTO : FormDTO {
    public Instance? LastInstance { get; set; }
}
public class FormWithUserDetailsDTO : FormWithLastInstanceDTO{
    public string? FirstName { get; set;}
    public string? LastName { get; set; }
}