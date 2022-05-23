using System.Collections.Generic;

namespace licenta.BLL.Models
{
    public class User : BaseUser
    {
        public string LoginUsername { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public List<Post> PostedPosts { get; set; }
        
        public List<WishlistPost> WishlistList { get; set; }

        public User(int id, string firstName, string lastName) : base(id, firstName, lastName) { }
        public User(){}
    }
}