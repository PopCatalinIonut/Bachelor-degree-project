using System.Collections.Generic;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public class UserWithWishlistDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string LoginUsername { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
        public List<PostWithUserDetailsDto> PostedPosts { get; set; }
        
        public List<PostWithUserDetailsDto> WishlistList { get; set; }
    }
}