using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace prid_2425_f06.Models
{
    public enum AccessType
    {
        User = 0, Editor = 1
        
    }
    
    public class FormAccess
    {
        [ForeignKey(nameof(Form))]
        public int FormId { get; set; }
        public Form Form { get; set; } = null!; 
    
        public int UserId { get; set; }
        public AccessType AccessType { get; set; } = AccessType.User;
        
        
    }
}