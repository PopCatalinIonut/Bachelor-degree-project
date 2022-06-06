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

        public ReturnedOutfitDto StartOutfitGenerator(GenerateOutfitDto data)
        {
            var outfit = new Outfit();
            
            var allFootwear = _context.Posts.Where((x) => x.Item.Type == "Footwear" && x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema).
                Include(x => x.Seller).ToList();
            
            var allPants = _context.Posts
                .Where((x) => x.Item.Type == "Clothing" && (x.Item.Category == "Shorts" || x.Item.Category == "Pants") && x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Include(x => x.Seller).ToList();
            
            var allTops = _context.Posts.Where((x) => x.Item.Type == "Clothing" &&
                 (x.Item.Category == "Sweatshirts" || x.Item.Category == "Hoodies" || x.Item.Category == "T-Shirts") && x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Include(x => x.Seller).ToList();
            
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
                allFootwear = allFootwear.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette || 
                    ((x.Item.ColorSchema.PredominantPalette == "Mixed") && 
                    ((data.ColorPalette == "Cool" && x.Item.ColorSchema.ContainsCool) || (data.ColorPalette == "Warm" && x.Item.ColorSchema.ContainsWarm)
                        || data.ColorPalette == "NonColor" && x.Item.ColorSchema.ContainsNonColor))).ToList();
                allPants = allPants.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette || 
                    ((x.Item.ColorSchema.PredominantPalette == "Mixed") && 
                    ((data.ColorPalette == "Cool" && x.Item.ColorSchema.ContainsCool) || (data.ColorPalette == "Warm" && x.Item.ColorSchema.ContainsWarm)
                        || data.ColorPalette == "NonColor" && x.Item.ColorSchema.ContainsNonColor))).ToList();
                allTops = allTops.Where(x => x.Item.ColorSchema.PredominantPalette == data.ColorPalette || 
                   ((x.Item.ColorSchema.PredominantPalette == "Mixed") && 
                   ((data.ColorPalette == "Cool" && x.Item.ColorSchema.ContainsCool) || (data.ColorPalette == "Warm" && x.Item.ColorSchema.ContainsWarm )
                       || data.ColorPalette == "NonColor" && x.Item.ColorSchema.ContainsNonColor))).ToList();
            }

            var maximumPrice = data.MaximumValue != 0 ? data.MaximumValue : double.MaxValue;
            
            
            var post = _context.Posts.Where(x => x.Id == data.PostId)
            .Include(x => x.Item).ThenInclude(x => x.Images)
            .Include(x => x.Seller)
            .Include(x => x.Item.ColorSchema).FirstOrDefault();

            GenerateOutfit(allFootwear,allPants,allTops,outfit,post,maximumPrice);
            return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
        }

        private static void GenerateOutfit(List<Post> footwearPosts, List<Post> pantsPosts, 
            List<Post> topPosts, Outfit outfit,Post starterPost, double maximumPrice) {
            var random = new Random();
            if (starterPost != null) {
                var postType = OutfitComponent.GetTypeOfItem(starterPost.Item);
                switch (postType)
                {
                    case "Footwear":
                        Utils.Utils.GenerateOutfitWithStarter(starterPost, topPosts, pantsPosts, maximumPrice, outfit); break;
                    case "Pants":
                        Utils.Utils.GenerateOutfitWithStarter(starterPost, topPosts, footwearPosts, maximumPrice, outfit); break;
                    case "Top":
                        Utils.Utils.GenerateOutfitWithStarter(starterPost, footwearPosts, pantsPosts, maximumPrice, outfit); break;
                }
            }
            else {
                var remaining = new[]{footwearPosts.Count != 0,pantsPosts.Count != 0,topPosts.Count != 0};
                while (!remaining.Contains(false)) {
                    var randomPicker = random.Next(0, 3);
                    switch (randomPicker) {
                        case 0 when footwearPosts.Count > 0: {
                            var item = footwearPosts[random.Next(0, footwearPosts.Count)];
                            var succes = Utils.Utils.GenerateOutfitWithStarter(item,pantsPosts,topPosts,maximumPrice,outfit);
                            if (succes) return;
                        
                            footwearPosts.Remove(item);
                            if (footwearPosts.Count == 0) remaining[0] = false;
                            break;
                        }
                        case 1 when pantsPosts.Count > 0: {
                            var item = pantsPosts[random.Next(0, pantsPosts.Count)];
                            var succes = Utils.Utils.GenerateOutfitWithStarter(item,footwearPosts,topPosts,maximumPrice,outfit);
                            if (succes) return;
                        
                            pantsPosts.Remove(item);
                            if (pantsPosts.Count == 0) remaining[1] = false;
                            break;
                        }
                        case 2 when topPosts.Count > 0: {
                            var item = topPosts[random.Next(0, topPosts.Count)];
                            var succes = Utils.Utils.GenerateOutfitWithStarter(item,pantsPosts,footwearPosts,maximumPrice,outfit);
                            if (succes) return;
                        
                            topPosts.Remove(item);
                            if (topPosts.Count == 0) remaining[2] = false;
                            break;
                        }
                    }
                }
            }
        }
    }
}