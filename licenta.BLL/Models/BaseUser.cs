using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class BaseUser
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}