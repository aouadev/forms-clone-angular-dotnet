namespace prid_2425_f06.Models;

public class OptionListDTO {
    public int Id { get; set;}
    public string Name { get; set;}="";
    public int? OwnerId { get; set;}

   
}

public class OptionListWithOptionValuesDto : OptionListDTO{
     public ICollection<OptionValueDTO> OptionValues { get; set;} = new HashSet<OptionValueDTO>();
}



  
