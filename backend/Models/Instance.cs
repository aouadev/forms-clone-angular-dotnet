using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f06.Models
{
    public class Instance
    {   
        private readonly FormContext? _context;
        public Instance(FormContext context){
            this._context = context;
        }
        public Instance(){}
        [Key]
        public int InstanceId { get; set; }
        [ForeignKey(nameof(Form))]
        public int FormId { get; set; } 
        public Form Form { get; set; } = null!;
        public int UserId { get; set; } 
     
        public DateTimeOffset Started { get; set; } = DateTimeOffset.Now;
        public DateTimeOffset? Completed { get; set; }

        public ICollection<Answer> Answers { get; set; } = new HashSet<Answer>();
        
        
    }


}