using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f06.Models;

public enum Role
{
    Admin = 2, User = 1, Guest = 0
}

public class User {
    [Key]
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public Role Role { get; set; } = Role.User;
    public DateTimeOffset? BirthDate { get; set; }
    public ICollection<Form> Forms { get; set; } = new HashSet<Form>();
    public ICollection<FormAccess> Accesses { get; set; } = new HashSet<FormAccess>();
    
    [NotMapped]
    public string? Token { get; set; }
}