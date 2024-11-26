using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace prid_2425_f06.Models
{
    public class Form
    {
        private readonly FormContext? _formContext;
        public Form() {}
        public Form(FormContext formContext) {
            this._formContext = formContext;
        }
        [Key]
        public int FormId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int OwnerId { get; set; } = 0;
        public bool IsPublic { get; set; } = false;
        public ICollection<FormAccess> Accesses { get; set; } = new HashSet<FormAccess>();
        public ICollection<Instance> Instances { get; set; } = new HashSet<Instance>();
        public ICollection<Question> Questions { get; set;} = new HashSet<Question>();
        


    }
}