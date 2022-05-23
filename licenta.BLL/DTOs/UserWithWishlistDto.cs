using System.Collections.Generic;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public class UserWithWishlistDto : BaseUser
    {
        public string LoginUsername { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        
        public List<PostWithUserDetailsDto> PostedPosts { get; set; }
        
        public List<PostWithUserDetailsDto> Wishlist { get; set; }

        public UserWithWishlistDto(int id, string firstName, string lastName) : base(id, firstName, lastName){ }
        
        public UserWithWishlistDto(){}
    }
}