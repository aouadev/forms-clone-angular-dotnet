using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; 
namespace prid_2425_f06.Models;

public class OptionValue {
     [ForeignKey(nameof(OptionList))]
    public int OptionListId { get; set; } = 0;
   
    public OptionList OptionList{ get; set; } = null!;
    public int Idx { get; set; } = 0;
    public string Label { get; set; } = "";
}