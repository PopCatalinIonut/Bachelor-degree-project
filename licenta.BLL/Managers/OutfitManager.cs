using System.Collections.Generic;
using System.Threading.Tasks;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;

namespace licenta.BLL.Managers
{
    public class OutfitManager
    {
        private readonly ShopDbContext _context;
        public OutfitManager(ShopDbContext context)
        {
            _context = context;
        }

        public List<Post> GenerateOutfit(GenerateOutfitDto data)
        {
            throw new System.NotImplementedException();
        }
    }
}