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

            var maximumPrice = data.MaximumValue != 0 ? data.MaximumValue : double.MaxValue;
            
            if (data.PostId != 0) {
                var post = _context.Posts.Where(x => x.Id == data.PostId)
                    .Include(x => x.Item).ThenInclude(x => x.Images)
                    .Include(x => x.Item.ColorSchema).FirstOrDefault();
                if (post != null)
                {
                    outfit.AddPostToOutfit(post);
                    CalculateOutfit(allFootwear, allPants, allTops, outfit,post,maximumPrice);
                    return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
                }
            }
            
            CalculateOutfit(allFootwear,allPants,allTops,outfit,null,maximumPrice);
            return DtoConverter.ConvertOutfitToReturnedOutfitDto(outfit);
        }

        private static void CalculateOutfit(List<Post> footwearPosts, List<Post> pantsPosts,
            List<Post> topPosts, Outfit outfit,Post post, double maximumPrice = double.MaxValue)
        {
            var random = new Random();
            
            var remaining = new[]{footwearPosts.Count == 0,pantsPosts.Count == 0,topPosts.Count == 0};
            while (remaining.Contains(false))
            {
                var starter = random.Next(0, 2);
                switch (starter)
                {
                    case 0 when footwearPosts.Count > 0:
                    {
                        var item = footwearPosts[random.Next(0, footwearPosts.Count - 1)];
                        var succes = CalculatePosibilities(item,outfit,footwearPosts: footwearPosts, topPosts: topPosts, pantsPosts:pantsPosts,maximumPrice:maximumPrice);
                        if (succes == false)
                        {
                            footwearPosts.Remove(item);
                            if (footwearPosts.Count == 0)
                                remaining[0] = true;
                        }
                        else return;
                        break;
                    }
                    case 1 when pantsPosts.Count > 0:
                    {
                        var item = pantsPosts[random.Next(0, pantsPosts.Count - 1)];
                        var succes = CalculatePosibilities(item,outfit, footwearPosts: footwearPosts, topPosts:topPosts, pantsPosts:pantsPosts,maximumPrice:maximumPrice);
                        if (succes == false)
                        {
                            pantsPosts.Remove(item);
                            if (pantsPosts.Count == 0)
                                remaining[1] = true;
                        }
                        else return;
                        break;
                    }
                    case 2 when topPosts.Count > 0:
                    {
                        var item = topPosts[random.Next(0, topPosts.Count - 1)];
                        var succes = CalculatePosibilities(item,outfit, footwearPosts: footwearPosts, pantsPosts:pantsPosts, topPosts:topPosts,maximumPrice:maximumPrice);
                        if (succes == false)
                        {
                            footwearPosts.Remove(item);
                            if (footwearPosts.Count == 0)
                                remaining[2] = true;
                        }
                        else return;
                        break;
                    }
                }
            }
           
        }

        private static bool CalculatePosibilities(Post post, Outfit outfit, List<Post> footwearPosts,
            List<Post> pantsPosts , List<Post> topPosts, double maximumPrice = double.MaxValue)
        {
            var postType = OutfitComponent.GetTypeOfItem(post.Item);

            var random = new Random();
            while (true)
            {
                Console.WriteLine(pantsPosts.Count + " " + footwearPosts.Count +"  " + topPosts.Count);
                if (pantsPosts.Count <= 0 || footwearPosts.Count<=0 || topPosts.Count <= 0) return false;
                switch (postType)
                {
                    case "Footwear" :
                    {
                        var item = footwearPosts[random.Next(0, footwearPosts.Count - 1)];
                        var pantsPost = Utils.Utils.CalculateDiffsForPost(post, pantsPosts,maximumPrice - item.Item.Price);
                        var topPost = Utils.Utils.CalculateDiffsForPost(post, topPosts,maximumPrice - item.Item.Price);
                        if (topPost == null || pantsPost == null)
                        {
                            footwearPosts.Remove(item);
                            if (footwearPosts.Count == 0)
                                return false;
                            break;
                        }

                        outfit.Components["Pants"] = pantsPost;
                        outfit.Components["Top"] = topPost;
                        outfit.Components["Footwear"] = item;
                        return true;

                    }
                    case "Pants" :
                    {
                        var item = pantsPosts[random.Next(0, pantsPosts.Count - 1)];
                        var footwearPost = Utils.Utils.CalculateDiffsForPost(post, footwearPosts,maximumPrice - item.Item.Price);
                        var topPost = Utils.Utils.CalculateDiffsForPost(post, topPosts,maximumPrice - item.Item.Price);
                        if (topPost == null || footwearPost == null)
                        {
                            pantsPosts.Remove(item);
                            if (pantsPosts.Count == 0)
                                return false; 
                            break;
                        }

                        outfit.Components["Pants"] = item;
                        outfit.Components["Top"] = topPost;
                        outfit.Components["Footwear"] = footwearPost;
                        return true;

                    }
                    case "Top":
                    {
                        var item = topPosts[random.Next(0, topPosts.Count - 1)];
                        var pantsPost = Utils.Utils.CalculateDiffsForPost(post, pantsPosts,maximumPrice - item.Item.Price);
                        var footwearPost = Utils.Utils.CalculateDiffsForPost(post, footwearPosts,maximumPrice - item.Item.Price);
                        if (footwearPost == null || pantsPost == null)
                        {
                            topPosts.Remove(item);
                            if (footwearPosts.Count == 0)
                                return false;
                            break;
                        }

                        outfit.Components["Pants"] = pantsPost;
                        outfit.Components["Top"] = item;
                        outfit.Components["Footwear"] = footwearPost;
                        return true;
                    }
                }
            }
        }



    }
}