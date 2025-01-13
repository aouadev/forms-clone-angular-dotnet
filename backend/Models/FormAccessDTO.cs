namespace prid_2425_f06.Models
{
    public class FormAccessDTO
    {
        public int FormId { get; set; } = 0;


        public int UserId { get; set; } = 0;
        public AccessType AccessType { get; set; } = AccessType.User;

    }

    public class FormAccessWithUserDetailsDTO : FormAccessDTO
    {
        public UserDTO User { get; set; }
       
    }
}