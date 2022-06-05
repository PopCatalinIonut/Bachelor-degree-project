using System.Collections.Generic;
using System.Linq;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;
using Microsoft.EntityFrameworkCore;

namespace licenta.BLL.Managers
{
    public class UserManager
    {
        private readonly ShopDbContext _context;
        public UserManager(ShopDbContext context){ _context = context; }
        public string AddUser(User userToAdd)
        {
            var message = "";
            
            var emailFound = _context.Users.Count(x => x.Email == userToAdd.Email);
            if (emailFound != 0)
                message += "There's already an account associated with this email.";
            
            var usernameFound = _context.Users.Count(x => x.LoginUsername == userToAdd.LoginUsername);
            if (usernameFound != 0)
            {
                if (message.Length > 0)
                    message= message[..^1] + " and username.";
                else
                    message += "There's already an account with this username.";
            }

            if (message.Length == 0) {
                _context.Users.Add(userToAdd);
                _context.SaveChanges();
            }
            
            return message;
        }
        public List<User> GetAllUsers() { return _context.Users.ToList(); }

        public UserWithWishlistDto VerifyUser(string username, string password)
        {
            var user = _context.Users
                .Include(x => x.PostedPosts)
                .ThenInclude(x => x.Item).ThenInclude(x => x.Images)
                .Include(x => x.PostedPosts).ThenInclude(x => x.Item.ColorSchema)
                .Include(x => x.WishlistList)
                .FirstOrDefault(x => x.LoginUsername == username && x.Password == password);
            if (user == null) return null;
            
            var posts = (
                from Posts in _context.Posts
                join WPost in _context.WishlistPosts on Posts.Id equals WPost.PostId
                where (WPost.UserId == user.Id)
                select new Post
                {
                    Id = Posts.Id,
                    CityLocation = Posts.CityLocation,
                    Date = Posts.Date,
                    Description = Posts.Description,
                    IsActive = Posts.IsActive,
                    Item = new Item(Posts.Item.Id,Posts.Item.Name,Posts.Item.Brand,Posts.Item.Type,Posts.Item.Category,Posts.Item.Genre,
                        Posts.Item.Size,Posts.Item.Fit,Posts.Item.Condition,Posts.Item.Price,Posts.Item.Images,Posts.Item.ColorSchema),
                    Seller = Posts.Seller,
                }
            ).ToList();
                
            return new UserWithWishlistDto
            {
                Email = user.Email,
                FirstName = user.FirstName,
                Id = user.Id,
                LastName = user.LastName,
                LoginUsername = user.LoginUsername,
                PostedPosts = DtoConverter.ConvertPostsToPostsWithUserDetailsDto(user.PostedPosts),
                Wishlist = DtoConverter.ConvertPostsToPostsWithUserDetailsDto(posts),
            };

        }
    }
}

