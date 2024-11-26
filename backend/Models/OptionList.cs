using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace prid_2425_f06.Models;
    public class OptionList
    {
        private readonly FormContext? _context;
        public OptionList(FormContext context) {
            this._context = context;
        }
        public OptionList() {}
        
        [Key]
        public int Id { get; set; } 
        public string Name { get; set; } = "";
        public int? OwnerId { get; set; } 

        public ICollection<OptionValue> OptionValues { get; set; } = new HashSet<OptionValue>();
        public ICollection<Question> Questions { get; set;} = new HashSet<Question>();
    }