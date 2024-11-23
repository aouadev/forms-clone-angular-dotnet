using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 

namespace prid_2425_f06 {
    public class OptionList
    {
        public int Id { get; set; } 
        public string Name { get; set; } = "";
        public int? Owner { get; set; } 

        public ICollection<OptionValue> OptionValues { get; set; } = new HashSet<OptionValue>();
        public ICollection<Question> Questions { get; set;} = new HashSet<Question>();
    }
}