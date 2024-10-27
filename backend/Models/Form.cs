using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace prid_2425_f06.Models
{
    public class Form
    {
        [Key]
        public int FormId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OwnerId { get; set; } = 0;
        public bool IsPublic { get; set; } = false;
        


    }
}