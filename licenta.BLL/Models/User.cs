using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string LoginUsername { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
        public List<Post> PostedPosts { get; set; }
        
        public List<WishlistPost> WishlistList { get; set; }

    }
}