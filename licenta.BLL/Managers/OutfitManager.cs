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
            var outfit = new Outfit();
            
            var allFootwear = _context.Posts.Where((x) => x.Item.Type == "Footwear" && 
                 (x.Item.Category == "Sneakers" || x.Item.Category == "Slides" || x.Item.Category == "Boots"))
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id, new User(x.Seller.Id, x.Seller.FirstName, x.Seller.LastName), x.Item,
                    x.Date, x.CityLocation, x.Description, x.IsActive)).ToList();
            
            var allPants = _context.Posts
                .Where((x) => x.Item.Type == "Clothing" && (x.Item.Category == "Shorts" || x.Item.Category == "Pants"))
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id, new User(x.Seller.Id, x.Seller.FirstName, x.Seller.LastName), x.Item,
                    x.Date, x.CityLocation, x.Description, x.IsActive)).ToList();
            
            var allTops = _context.Posts.Where((x) => x.Item.Type == "Clothing" &&
                 (x.Item.Category == "Sweatshirts" || x.Item.Category == "Hoodies" || x.Item.Category == "T-Shirts"))
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

            if (data.PostId != 0) {
                var post = _context.Posts.Where(x => x.Id == data.PostId)
                    .Include(x => x.Item).ThenInclude(x => x.Images)
                    .Include(x => x.Item.ColorSchema).FirstOrDefault();
                if (post != null)
                {
                    outfit.AddPostToOutfit(post);
                    CalculateOutfit(post, allFootwear, allPants, allTops, outfit);
                    return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
                }
            }
            
            var tries = new[]{false,false,false};
            var done = false;
            while (tries.Contains(false) && done == false) {
                var starter = random.Next(0, 2);
                switch (starter) {
                    case 0 when tries[0] == false: {
                        if (allFootwear.Count == 0) { tries[0] = true; break; }
                        var item = allFootwear[random.Next(0, allFootwear.Count - 1)];
                        CalculateOutfit(item,allFootwear,allPants,allTops,outfit);
                        outfit.Components["Footwear"] = item;
                        done = true;
                        break;
                    }
                    case 1 when tries[1] == false: {
                        if (allPants.Count == 0) { tries[1] = true; break; }
                        var item = allPants[random.Next(0, allPants.Count - 1)];
                        CalculateOutfit(item,allFootwear,allPants,allTops,outfit);
                        outfit.Components["Pants"] = item;
                        done = true;
                        break;
                    }
                    case 2 when tries[2] == false: {
                        if (allTops.Count == 0) { tries[2] = true; break; }
                        var item = allTops[random.Next(0, allTops.Count - 1)];
                        CalculateOutfit(item,allFootwear,allPants,allTops,outfit);
                        outfit.Components["Top"] = item;
                        done = true;
                        break;
                    }
                }
            }
            return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
        }

        private static void CalculateOutfit(Post post, List<Post> footwearPosts, List<Post> pantsPosts,
            List<Post> topPosts, Outfit outfit)
        {
            var postType = OutfitComponent.GetTypeOfItem(post.Item);
            switch (postType)
            {
                case "Footwear":
                {
                    outfit.Components["Pants"] = Utils.Utils.CalculateDiffsForPost(post, pantsPosts);
                    outfit.Components["Top"] = Utils.Utils.CalculateDiffsForPost(post, topPosts);
                    break;
                }
                case "Pants":
                {
                    outfit.Components["Footwear"] = Utils.Utils.CalculateDiffsForPost(post, footwearPosts);
                    outfit.Components["Top"] = Utils.Utils.CalculateDiffsForPost(post, topPosts);
                    break;
                }
                case "Top":
                {
                    outfit.Components["Footwear"] = Utils.Utils.CalculateDiffsForPost(post, footwearPosts);
                    outfit.Components["Pants"] = Utils.Utils.CalculateDiffsForPost(post, pantsPosts);
                    break;
                }
            }
        }

    }
}