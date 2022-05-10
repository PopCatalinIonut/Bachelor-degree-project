using System.Collections.Generic;
using System.Linq;
using licenta.BLL.Helpers;
using licenta.BLL.Models;

namespace licenta.BLL.Managers
{
    public class UserManager
    {
        private readonly ShopDbContext _context;
        public UserManager(ShopDbContext context)
        {
            _context = context;
        }
        public User VerifyUser(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(x => x.LoginUsername == username && x.Password == password);
            return user;
        }

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
        public List<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }

    }
}

