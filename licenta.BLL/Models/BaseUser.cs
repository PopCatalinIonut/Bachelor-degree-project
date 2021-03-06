using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class BaseUser
    {
        public BaseUser(int id, string firstName, string lastName)
        {
            Id = id;
            FirstName = firstName;
            LastName = lastName;
        }
        public BaseUser(){}
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}