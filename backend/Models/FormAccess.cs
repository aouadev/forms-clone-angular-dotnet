using System.ComponentModel.DataAnnotations;

namespace prid_2425_f06.Models
{
    public enum AccessType
    {
        User = 0, Editor = 1
        
    }
    
    public class FormAccess
    {
    
        public int FormId { get; set; }
    
        public int UserId { get; set; }
        public AccessType AccessType { get; set; } = AccessType.User;
        
        
    }
}