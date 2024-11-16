namespace prid_2425_f06.Models;

public class InstanceDTO {
    public int InstanceId { get; set; }
    public int FormId { get; set; } 
    public int UserId { get; set; } 
    public DateTimeOffset Started { get; set; } = DateTimeOffset.Now;
    public DateTimeOffset? Completed { get; set; }
}