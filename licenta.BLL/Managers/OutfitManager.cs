﻿using System;
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
            List<Post> topPosts, Outfit outfit,Post post, double maximumPrice)
        {
            var random = new Random();
            var remaining = new[]{footwearPosts.Count != 0,pantsPosts.Count != 0,topPosts.Count != 0};
            
            if (post != null)
            {
                var finished = false;
                var postType = OutfitComponent.GetTypeOfItem(post.Item);
                while(finished == false &&pantsPosts.Count > 0 && footwearPosts.Count > 0 && topPosts.Count > 0)
                    switch (postType)
                    {
                        case "Footwear":
                        {
                            var pantsPost = Utils.Utils.CalculateDiffsForPost(post, pantsPosts,maximumPrice);
                            if (pantsPost == null) return;
                            
                            var newPrice = maximumPrice - pantsPost.Item.Price;
                            var topPost = Utils.Utils.CalculateDiffsForPost(post, topPosts, newPrice);
                            if (topPost != null)
                            {
                                outfit.Components["Pants"] = pantsPost;
                                outfit.Components["Top"] = topPost;
                                outfit.Components["Footwear"] = post;
                                finished = true;
                            }
                            else pantsPosts.Remove(pantsPost);
                            break;
                        }

                        case "Pants":
                        {
                            var footwearPost = Utils.Utils.CalculateDiffsForPost(post, footwearPosts,maximumPrice);
                            if (footwearPost == null) return;
                            
                            var newPrice = maximumPrice - footwearPost.Item.Price;
                            var topPost = Utils.Utils.CalculateDiffsForPost(post, topPosts,maximumPrice - newPrice);
                            if (topPost != null)
                            {
                                outfit.Components["Pants"] = post;
                                outfit.Components["Top"] = topPost;
                                outfit.Components["Footwear"] = footwearPost;
                                finished = true;
                            }
                            else footwearPosts.Remove(footwearPost);
                            break;
                        }
                        case "Top":
                        {
                            var pantsPost = Utils.Utils.CalculateDiffsForPost(post, pantsPosts,maximumPrice);
                            if (pantsPost == null) return;

                            var newPrice = maximumPrice - pantsPost.Item.Price;
                            var footwearPost = Utils.Utils.CalculateDiffsForPost(post, footwearPosts,newPrice);
                            if (footwearPost != null)
                            {
                                outfit.Components["Pants"] = pantsPost;
                                outfit.Components["Top"] = post;
                                outfit.Components["Footwear"] = footwearPost;
                                finished = true;
                            }
                            else pantsPosts.Remove(pantsPost);
                            break;
                        }
                    }
            }
            else
                while (remaining.Contains(true))
                {
                    var starter = random.Next(0, 3);
                    switch (starter)
                    {
                        case 0 when footwearPosts.Count > 0:
                        {
                            var item = footwearPosts[random.Next(0, footwearPosts.Count)];
                            var succes = CalculatePosibilities(item,outfit,footwearPosts: footwearPosts, topPosts: topPosts, pantsPosts:pantsPosts,maximumPrice:maximumPrice);
                            if (succes) return;
                        
                            footwearPosts.Remove(item);
                            if (footwearPosts.Count == 0)
                                remaining[0] = false;
                            break;
                        }
                        case 1 when pantsPosts.Count > 0:
                        {
                            var item = pantsPosts[random.Next(0, pantsPosts.Count)];
                            var succes = CalculatePosibilities(item,outfit, footwearPosts: footwearPosts, topPosts:topPosts, pantsPosts:pantsPosts,maximumPrice:maximumPrice);
                            if (succes) return;
                        
                            pantsPosts.Remove(item);
                            if (pantsPosts.Count == 0)
                                remaining[1] = false;
                            break;
                        }
                        case 2 when topPosts.Count > 0:
                        {
                            var item = topPosts[random.Next(0, topPosts.Count)];
                            var succes = CalculatePosibilities(item,outfit, footwearPosts: footwearPosts, pantsPosts:pantsPosts, topPosts:topPosts,maximumPrice:maximumPrice);
                            if (succes) return;
                        
                            topPosts.Remove(item);
                            if (topPosts.Count == 0)
                                remaining[2] = false;
                            break;
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
                    case "Footwear" :
                    {
                        var item = footwearPostsCopy[random.Next(0, footwearPostsCopy.Count)];
                        var newPrice = maximumPrice - item.Item.Price;
                        var pantsPost = Utils.Utils.CalculateDiffsForPost(item, pantsPostsCopy,newPrice);
                        if(pantsPost != null) 
                            newPrice -= pantsPost.Item.Price;
                        var topPost = Utils.Utils.CalculateDiffsForPost(item, topPostsCopy, newPrice);
                        if (topPost == null || pantsPost == null)
                        {
                            footwearPostsCopy.Remove(item);
                            if (footwearPostsCopy.Count == 0)
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
                        var item = pantsPostsCopy[random.Next(0, pantsPostsCopy.Count)];
                        var newPrice = maximumPrice - item.Item.Price;
                        var footwearPost = Utils.Utils.CalculateDiffsForPost(item, footwearPostsCopy,newPrice);
                        if(footwearPost != null) 
                            newPrice -= footwearPost.Item.Price;
                        var topPost = Utils.Utils.CalculateDiffsForPost(item, topPostsCopy,newPrice);
                        if (topPost == null || footwearPost == null)
                        {
                            pantsPostsCopy.Remove(item);
                            if (pantsPostsCopy.Count == 0)
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
                        var item = topPostsCopy[random.Next(0, topPostsCopy.Count)];
                        var newPrice = maximumPrice - item.Item.Price;
                        var pantsPost = Utils.Utils.CalculateDiffsForPost(item, pantsPostsCopy,newPrice);    
                        if(pantsPost != null) 
                            newPrice -= pantsPost.Item.Price;
                        var footwearPost = Utils.Utils.CalculateDiffsForPost(item, footwearPostsCopy,newPrice);
                        if (footwearPost == null || pantsPost == null)
                        {
                            topPostsCopy.Remove(item);
                            if (footwearPostsCopy.Count == 0)
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