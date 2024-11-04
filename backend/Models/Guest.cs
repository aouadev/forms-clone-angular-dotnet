namespace prid_2425_f06.Models
{
    public class Guest : User
    {
        public Guest() {
            Email = "guest@epfc.eu";
            Role = Role.Guest;
            
        }
    }
}