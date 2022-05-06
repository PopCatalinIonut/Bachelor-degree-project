using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using licenta.BLL.DTOs;
using licenta.BLL.Models;

namespace licenta.BLL.Managers
{
    public class UserManager
    {
        private readonly ShopDbContext _context;

        // private readonly IMapper _mapper;

        public UserManager(ShopDbContext context)
        {
            _context = context;
            //  _mapper = mapper;
        }

        public List<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }
        public User GetUser(int id)
        {
            var user = _context.Users.Find(id);
            return user;
        }

        public User VerifyUser(string username, string password)
        {
            var user = _context.Users.FirstOrDefault(x => x.LoginUsername == username && x.Password == password);
            return user;
        }

        public string AddUser(User userToAdd)
        {
            var errorMessage = "";
            
            var email = _context.Users.Count(x => x.Email == userToAdd.Email);
            if (email != 0)
                errorMessage += "There's already an account associated with this email.";
            
            var username = _context.Users.Count(x => x.LoginUsername == userToAdd.LoginUsername);
            if (username != 0)
            {
                if (errorMessage.Length > 0)
                    errorMessage= errorMessage.Substring(0, errorMessage.Length - 1) + " and username.";
                else
                    errorMessage += "There's already an account with this username.";
            }

            if (errorMessage.Length == 0) {
                _context.Users.Add(userToAdd);
                _context.SaveChanges();
            }
            
            return errorMessage;
        }
    }
}

