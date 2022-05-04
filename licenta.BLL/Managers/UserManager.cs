using System.Collections.Generic;
using System.Linq;
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

        public bool VerifyUser(string username, string password)
        {
            var user = _context.Users
                .First(x => x.LoginUsername == username && x.Password == password);
            return user != null;
        }
        public User AddUser(User userToAdd)
        {
            _context.Users.Add(userToAdd);
            _context.SaveChanges();
            return userToAdd;
        }

    }
}
