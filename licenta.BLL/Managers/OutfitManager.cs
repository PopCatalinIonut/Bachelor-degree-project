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
            var outfit = new Outfit();
            
            var allFootwear = _context.Posts.Where((x) => x.Item.Type == "Footwear" && 
                 (x.Item.Category == "Sneakers" || x.Item.Category == "Slides" || x.Item.Category == "Boots") && x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id, new User(x.Seller.Id, x.Seller.FirstName, x.Seller.LastName), x.Item,
                    x.Date, x.CityLocation, x.Description, x.IsActive)).ToList();
            
            var allPants = _context.Posts
                .Where((x) => x.Item.Type == "Clothing" && (x.Item.Category == "Shorts" || x.Item.Category == "Pants") && x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id, new User(x.Seller.Id, x.Seller.FirstName, x.Seller.LastName), x.Item,
                    x.Date, x.CityLocation, x.Description, x.IsActive)).ToList();
            
            var allTops = _context.Posts.Where((x) => x.Item.Type == "Clothing" &&
                 (x.Item.Category == "Sweatshirts" || x.Item.Category == "Hoodies" || x.Item.Category == "T-Shirts") && x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id, new User(x.Seller.Id, x.Seller.FirstName, x.Seller.LastName), x.Item,
                    x.Date, x.CityLocation, x.Description, x.IsActive)).ToList();
            
            if (!string.IsNullOrEmpty(data.Season))
                switch (data.Season)
                {
                    case "Winter":
                        allFootwear = allFootwear.Where(x => x.Item.Category == "Boots").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Pants").ToList();
                        allTops = allTops.Where(x => x.Item.Category != "T-Shirts").ToList();
                        break;
                    case "Summer":
                        allFootwear = allFootwear.Where(x => x.Item.Category != "Boots").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Shorts").ToList();
                        allTops = allTops.Where(x => x.Item.Category == "T-Shirts").ToList();
                        break;
                    case "Spring":
                        allFootwear = allFootwear.Where(x => x.Item.Category != "Slides").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Pants").ToList();
                        break;
                    case "Fall":
                        allFootwear = allFootwear.Where(x => x.Item.Category != "Slides").ToList();
                        allPants = allPants.Where(x => x.Item.Category == "Pants").ToList();
                        allTops = allTops.Where(x => x.Item.Category != "T-Shirts").ToList();
                        break;
                }

            if (!string.IsNullOrEmpty(data.Genre))
            {
                allFootwear = allFootwear.Where(x => x.Item.Genre == data.Genre || x.Item.Genre == "Unisex").ToList();
                allPants = allPants.Where(x => x.Item.Genre == data.Genre || x.Item.Genre == "Unisex").ToList();
                allTops = allTops.Where(x => x.Item.Genre == data.Genre || x.Item.Genre == "Unisex").ToList();
            }

            if (!string.IsNullOrEmpty(data.Condition))
            {
                allFootwear = allFootwear.Where(x => x.Item.Condition == data.Condition).ToList();
                allPants = allPants.Where(x => x.Item.Condition == data.Condition).ToList();
                allTops = allTops.Where(x => x.Item.Condition == data.Condition).ToList();
            }

            if (!string.IsNullOrEmpty(data.ShoeSize))
                allFootwear = allFootwear.Where(x => x.Item.Size == data.ShoeSize).ToList();

            if (!string.IsNullOrEmpty(data.ClothingSize))
            {
                allPants = allPants.Where(x => x.Item.Size == data.ClothingSize).ToList();
                allTops = allTops.Where(x => x.Item.Size == data.ClothingSize).ToList();
            }

            if (!string.IsNullOrEmpty(data.ColorPalette))
            {
                allFootwear = allFootwear.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette).ToList();
                allPants = allPants.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette).ToList();
                allTops = allTops.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette).ToList();
            }

            var maximumPrice = data.MaximumValue != 0 ? data.MaximumValue : double.MaxValue;
            
            
            var post = _context.Posts.Where(x => x.Id == data.PostId)
            .Include(x => x.Item).ThenInclude(x => x.Images)
            .Include(x => x.Item.ColorSchema).FirstOrDefault();

            CalculateOutfit(allFootwear,allPants,allTops,outfit,post,maximumPrice);
            return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
        }

        private static void CalculateOutfit(List<Post> footwearPosts, List<Post> pantsPosts,
            List<Post> topPosts, Outfit outfit,Post post, double maximumPrice)
        {
            var random = new Random();
            
            if (post != null)
            {
                var postType = OutfitComponent.GetTypeOfItem(post.Item);
                switch (postType)
                {
                    case "Footwear":
                        Utils.Utils.GenerateOutfitWithStarterBacktr(post, topPosts, pantsPosts, maximumPrice, outfit);
                        break;

                    case "Pants":
                        Utils.Utils.GenerateOutfitWithStarterBacktr(post, topPosts, footwearPosts, maximumPrice, outfit);
                        break;

                    case "Top":
                        Utils.Utils.GenerateOutfitWithStarterBacktr(post, footwearPosts, pantsPosts, maximumPrice, outfit);
                        break;
                }
            }
            else {
                var remaining = new[]{footwearPosts.Count != 0,pantsPosts.Count != 0,topPosts.Count != 0};
                while (remaining.Contains(true)) {
                    
                    var starter = random.Next(0, 3);
                    switch (starter)
                    {
                        case 0 when footwearPosts.Count > 0:
                        {
                            var item = footwearPosts[random.Next(0, footwearPosts.Count)];
                            var succes = CalculatePosibilities(item,outfit,footwearPosts: footwearPosts, topPosts: topPosts, pantsPosts:pantsPosts,maximumPrice:maximumPrice);
                            if (succes) return;
                        
                            footwearPosts.Remove(item);
                            if (footwearPosts.Count == 0) remaining[0] = false;
                            break;
                        }
                        case 1 when pantsPosts.Count > 0:
                        {
                            var item = pantsPosts[random.Next(0, pantsPosts.Count)];
                            var succes = CalculatePosibilities(item,outfit, footwearPosts: footwearPosts, topPosts:topPosts, pantsPosts:pantsPosts,maximumPrice:maximumPrice);
                            if (succes) return;
                        
                            pantsPosts.Remove(item);
                            if (pantsPosts.Count == 0) remaining[1] = false;
                            break;
                        }
                        case 2 when topPosts.Count > 0:
                        {
                            var item = topPosts[random.Next(0, topPosts.Count)];
                            var succes = CalculatePosibilities(item,outfit, footwearPosts: footwearPosts, pantsPosts:pantsPosts, topPosts:topPosts,maximumPrice:maximumPrice);
                            if (succes) return;
                        
                            topPosts.Remove(item);
                            if (topPosts.Count == 0) remaining[2] = false;
                            break;
                        }
                    }
                }
            }
        }
        private static bool CalculatePosibilities(Post post, Outfit outfit, List<Post> footwearPosts,
            List<Post> pantsPosts , List<Post> topPosts, double maximumPrice)
        {
            var postType = OutfitComponent.GetTypeOfItem(post.Item);

            var pantsPostsCopy = new List<Post>(pantsPosts);
            var footwearPostsCopy = new List<Post>(footwearPosts);
            var topPostsCopy = new List<Post>(topPosts);
            var random = new Random();
            while (true)
            {
                if (pantsPostsCopy.Count == 0 || footwearPostsCopy.Count == 0 || topPostsCopy.Count == 0) return false;
                switch (postType)
                {
                    case "Footwear":
                    {
                        var item = footwearPostsCopy[random.Next(0, footwearPostsCopy.Count)];
                        var pantsPost = Utils.Utils.GenerateOutfitWithStarterBacktr(item, pantsPostsCopy,topPostsCopy, maximumPrice,outfit);

                        if (pantsPost) return true;
                        
                        footwearPostsCopy.Remove(item);
                        if (footwearPostsCopy.Count == 0) return false;
                        
                        break;
                    }
                    case "Pants" :
                    {
                        var item = pantsPostsCopy[random.Next(0, pantsPostsCopy.Count)];
                        var footwearPost = Utils.Utils.GenerateOutfitWithStarterBacktr(item,topPostsCopy, footwearPostsCopy,maximumPrice,outfit);

                        if (footwearPost) return true;
                        
                        pantsPostsCopy.Remove(item);
                        if (pantsPostsCopy.Count == 0) return false; 
                        
                        break;

                    }
                    case "Top":
                    {
                        var item = topPostsCopy[random.Next(0, topPostsCopy.Count)];
                        var pantsPost = Utils.Utils.GenerateOutfitWithStarterBacktr(item,footwearPostsCopy, pantsPostsCopy, maximumPrice,outfit);

                        if (pantsPost) return true;
                        
                        topPostsCopy.Remove(item);
                        if (footwearPostsCopy.Count == 0) return false;
                        
                        break;
                    }
                }
            }
        }
    }
}