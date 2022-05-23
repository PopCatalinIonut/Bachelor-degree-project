using System;
using System.Collections.Generic;
using System.Linq;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;
using Microsoft.EntityFrameworkCore;

namespace licenta.BLL.Managers
{
    public class OutfitManager
    {
        private readonly ShopDbContext _context;
        public OutfitManager(ShopDbContext context)
        {
            _context = context;
        }

        public ReturnedOutfitDto GenerateOutfit(GenerateOutfitDto data)
        {
            var random = new Random();
            var allFootwear = _context.Posts.Where((x) => x.Item.Type == "Footwear" && (x.Item.Category == "Sneakers" || x.Item.Category == "Slides" || x.Item.Category =="Boots"))
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id,new User(x.Seller.Id,x.Seller.FirstName,x.Seller.LastName),x.Item,x.Date,x.CityLocation,x.Description,x.IsActive)).ToList();
            var allPants = _context.Posts.Where((x) => x.Item.Type == "Clothing" && (x.Item.Category == "Shorts" || x.Item.Category == "Pants") ).Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id,new User(x.Seller.Id,x.Seller.FirstName,x.Seller.LastName),x.Item,x.Date,x.CityLocation,x.Description,x.IsActive)).ToList();
            var allTops = _context.Posts.Where((x) =>
                x.Item.Type == "Clothing" && (x.Item.Category == "Sweatshirts" || x.Item.Category == "Hoodies" || x.Item.Category == "T-Shirts")) .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id,new User(x.Seller.Id,x.Seller.FirstName,x.Seller.LastName),x.Item,x.Date,x.CityLocation,x.Description,x.IsActive)).ToList();
            if(!string.IsNullOrEmpty(data.Season))
                switch (data.Season) {
                    case "Winter": allFootwear = allFootwear.Where(x => x.Item.Category == "Boots").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Pants").ToList();
                        allTops = allTops.Where(x => x.Item.Category != "T-Shirts").ToList();
                        break;
                    case "Summer": allFootwear = allFootwear.Where(x => x.Item.Category != "Boots").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Shorts").ToList();
                        allTops = allTops.Where(x => x.Item.Category == "T-Shirts").ToList();
                        break;
                    case "Spring": allFootwear = allFootwear.Where(x => x.Item.Category != "Slides").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Pants").ToList();
                        break;
                    case "Fall":  allFootwear = allFootwear.Where(x => x.Item.Category != "Slides").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Pants").ToList();
                        allTops = allTops.Where(x => x.Item.Category != "T-Shirts").ToList();
                        break;
                }

            if(!string.IsNullOrEmpty(data.Genre)) {
               allFootwear = allFootwear.Where(x => x.Item.Genre == data.Genre || x.Item.Genre == "Unisex").ToList();
               allPants = allPants.Where(x => x.Item.Genre == data.Genre || x.Item.Genre == "Unisex").ToList(); 
               allTops = allTops.Where(x => x.Item.Genre == data.Genre || x.Item.Genre == "Unisex").ToList();
            }
            
            if (!string.IsNullOrEmpty(data.Condition)) {
                allFootwear = allFootwear.Where(x => x.Item.Condition == data.Condition).ToList();
                allPants = allPants.Where(x => x.Item.Condition == data.Condition).ToList();
                allTops = allTops.Where(x => x.Item.Condition == data.Condition).ToList();
            }

            if (!string.IsNullOrEmpty(data.ShoeSize))
                allFootwear = allFootwear.Where(x => x.Item.Size == data.ShoeSize).ToList();

            if (!string.IsNullOrEmpty(data.ClothingSize)) {  
                allPants = allPants.Where(x => x.Item.Size == data.ClothingSize).ToList();
                allTops = allTops.Where(x => x.Item.Size == data.ClothingSize).ToList();
            }

            if (!string.IsNullOrEmpty(data.ColorPalette))
            {
                allFootwear = allFootwear.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette).ToList();
                allPants = allPants.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette).ToList();
                allTops = allTops.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette).ToList();
            }
            
            var outfit = new Outfit();
            if(allFootwear.Count > 0)
                outfit.AddPostToOutfit(allFootwear[random.Next(0,allFootwear.Count-1)]);
            if(allPants.Count > 0)
                outfit.AddPostToOutfit(allPants[random.Next(0,allPants.Count-1)]);
            if(allTops.Count > 0)
                outfit.AddPostToOutfit(allTops[random.Next(0,allTops.Count-1)]);

        
            return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
        }
    }
}