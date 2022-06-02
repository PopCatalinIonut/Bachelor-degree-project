using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using licenta.BLL.Models;
using Newtonsoft.Json;

namespace licenta.BLL.Utils
{
    public static class Utils
    {
        private static Dictionary<string,List<string>> ColorsDictionary { get; set; }
        private static Dictionary<string, int> ConditionDictionary { get; set; }
        private static Dictionary<string, int> ClothingSizes { get; set; }
        public static ColorSchema CalculateItemColorSchema(List<string> colors)
        {
            var schema = new ColorSchema(colors);
            int coolCount = 0, warmCount = 0, nonColorCount = 0;
             schema.Colors.ForEach((color) =>
            {
                switch (ColorsDictionary.FirstOrDefault(x => x.Value.Contains(color)).Key)
                {
                    case "Warm": warmCount++;
                        break;
                    case "Cool": coolCount++;
                        break;
                    case "NonColor": nonColorCount++;
                        break;
                }
            });
             if (coolCount > 0) schema.ContainsCool = true;
             if (warmCount > 0) schema.ContainsWarm = true;
             if (nonColorCount > 0) schema.ContainsNonColor = true;

             if (warmCount == coolCount || warmCount == nonColorCount || coolCount == nonColorCount)
                 schema.PredominantPalette = "Mixed";
             else if (warmCount > coolCount && warmCount > nonColorCount)
                 schema.PredominantPalette = "Warm";
             else if (coolCount > warmCount && coolCount > nonColorCount)
                 schema.PredominantPalette = "Cool";
             else schema.PredominantPalette = "NonColor";
             return schema;
        }

        private static double CalculateSimilarity(Item firstItem, Item secondItem)
        {
            firstItem = (Item) firstItem.Clone(); 
            secondItem = (Item) secondItem.Clone(); 
            var pointsOfSimilarity = 0d;
            var totalPointsAvailable = 90d;

            pointsOfSimilarity += 30 * CalculateItemTypesSimilarity(firstItem, secondItem);
            if (firstItem.Genre == "Unisex" || secondItem.Genre == "Unisex")
                pointsOfSimilarity += 10;
            else if (firstItem.Genre == secondItem.Genre)
                pointsOfSimilarity += 15;
            pointsOfSimilarity += 45 * CalculateColorSchemaSimilarity(firstItem.ColorSchema, secondItem.ColorSchema);
            return pointsOfSimilarity/totalPointsAvailable;
        }

        private static double CalculateItemTypesSimilarity(Item firstItem, Item secondItem)
        {
            var pointsOfSimilarity = 0d;
            var totalPointsAvailable = 15d;
            if (firstItem.Type == "Footwear" || secondItem.Type == "Footwear")
            {
                if (secondItem.Type == "Footwear")
                    (firstItem, secondItem) = (secondItem, firstItem);
                
                switch (firstItem.Category)
                {
                    case "Boots":
                    {
                        if (secondItem.Category is "Hoodies" or "Sweatshirt" or "Pants")
                            pointsOfSimilarity += 15;
                        else if (secondItem.Category is "T-Shirts")
                            pointsOfSimilarity += 5;
                        break;
                    }
                    case "Slides":
                    {
                        if (secondItem.Category is "T-Shirts" or "Shorts")
                            pointsOfSimilarity += 15;
                        else if (secondItem.Category is "Sweatshirts")
                            pointsOfSimilarity += 9;
                        else if (secondItem.Category is "Hoodies" or "Pants")
                            pointsOfSimilarity += 3;
                        break;
                    }
                    case "Sneakers":
                    {
                        pointsOfSimilarity += 15;
                        break;
                    }
                }
            }
            else if (firstItem.Type == "Clothing" && secondItem.Type == "Clothing")
            {
                if (OutfitComponent.GetTypeOfItem(firstItem) == "Top")
                    (firstItem, secondItem) = (secondItem, firstItem);

                switch (firstItem.Category)
                {
                    case "Shorts":
                    {
                        if (secondItem.Category is "T-Shirts")
                            pointsOfSimilarity += 15;
                        else if (secondItem.Category is "Sweatshirts")
                            pointsOfSimilarity += 9;
                        else if (secondItem.Category is "Hoodies")
                            pointsOfSimilarity += 3;
                        break;
                    }
                    case "Pants":
                    {
                        if (secondItem.Category is "Sweatshirts" or "Hoodies")
                            pointsOfSimilarity += 15;
                        else if (secondItem.Category is "T-Shirts")
                            pointsOfSimilarity += 5;
                        break;
                    }
                }
                
                var sizeDifference = Math.Abs(ClothingSizes[firstItem.Size] - ClothingSizes[secondItem.Size]);
                var fitDifference = Math.Abs(ClothingSizes[firstItem.Fit] - ClothingSizes[secondItem.Fit]);
                
                totalPointsAvailable += 25;
                pointsOfSimilarity += sizeDifference == 0 ? 10 : 10 - ((sizeDifference/ ClothingSizes.Count) * 10);
                pointsOfSimilarity += fitDifference == 0 ? 15 : 15 - ((fitDifference / ClothingSizes.Count) * 15);
            }

            return pointsOfSimilarity / totalPointsAvailable;
        }
            
        private static Dictionary<Post,double> CalculateSimilaritiesForPost(List<Post> toCompareWith, List<Post> toPickFrom)
        {
            var similarities = new Dictionary<Post,double>();
            toPickFrom.ForEach(x =>
            {
                similarities.Add(x,0);
                toCompareWith.ForEach(y =>
                {
                    similarities[x] += CalculateSimilarity(x.Item, y.Item);
                });
                similarities[x] /= toCompareWith.Count;
            });
            similarities = new Dictionary<Post, double>(similarities.OrderByDescending(x => x.Value));
            return similarities;
        }

        private static Post CalculateDiffsAndPostForPost(List<Post> toCompareWith, List<Post> toPickFrom, double price)
        {
            var similarities = CalculateSimilaritiesForPost(toCompareWith, toPickFrom);
            return GetPostBySimilarityList(similarities, toCompareWith, price);
        }

        public static bool GenerateOutfitWithStarterBacktr(Post starter, List<Post> toCompareWith1,
            List<Post> toCompareWith2, double maximumPrice, Outfit outfit)
        {
            
            var similarities = CalculateSimilaritiesForPost(new List<Post>() { starter }, toCompareWith1);
            while (similarities.First().Value > 0.6)
            {
                var secondItem = GetPostBySimilarityList(similarities, new List<Post>() { starter }, maximumPrice);
                if (secondItem == null) return false;

                var thirdItem = CalculateDiffsAndPostForPost(new List<Post>() { starter, secondItem }, toCompareWith2,
                    maximumPrice);
                
                if (thirdItem == null)
                    similarities.Remove(secondItem);
                else
                {
                    outfit.Components[OutfitComponent.GetTypeOfItem(starter.Item)] = starter;
                    outfit.Components[OutfitComponent.GetTypeOfItem(secondItem.Item)] = secondItem;
                    outfit.Components[OutfitComponent.GetTypeOfItem(thirdItem.Item)] = thirdItem;
                    return true;
                }
            }
            return false;
        }

        private static Post GetPostBySimilarityList(Dictionary<Post, double> similarities, List<Post> toCompareWith, double maximumPrice)
        { 
            
            var aboveLimit = similarities.Count(x => x.Value > 0.6);
            var random = new Random();
            while (similarities.Count > 0 && aboveLimit > 0)
            {
                var post = similarities.ElementAt(random.Next(0, aboveLimit)).Key;
                if (post.Item.Price + toCompareWith.Sum(x => x.Item.Price) <= maximumPrice)
                    return post;

                similarities.Remove(post);
                aboveLimit--;
            }
            return null;
        }
        private static double CalculateColorSchemaSimilarity(ColorSchema firstSchema, ColorSchema secondSchema)
        {
            var pointsOfSimilarity = 0;
            var totalPointsAvailable = 25d;

            if(firstSchema.Colors.Count > secondSchema.Colors.Count)
                (firstSchema.Colors , secondSchema.Colors) = (secondSchema.Colors, firstSchema.Colors);
            pointsOfSimilarity += firstSchema.ContainsCool == secondSchema.ContainsCool ? 5 : 0;
            pointsOfSimilarity += firstSchema.ContainsWarm == secondSchema.ContainsWarm ? 5 : 0;
            pointsOfSimilarity += firstSchema.ContainsNonColor == secondSchema.ContainsNonColor ? 5 : 0;
            
            firstSchema.Colors.ForEach((color) =>
            {
                totalPointsAvailable += 5;
                if (secondSchema.Colors.Contains(color))
                    pointsOfSimilarity += 5;
            });
            return pointsOfSimilarity/totalPointsAvailable;
        }
        static Utils()
        {
            var propsFileLocation
                = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName + @"\"+ "ItemProperties.json";
            var text = File.ReadAllText(propsFileLocation);
            var itemProperties = JsonConvert.DeserializeObject<ItemProperties>(text);
            ColorsDictionary = new Dictionary<string, List<string>>();
            ConditionDictionary = new Dictionary<string, int>();
            ClothingSizes = new Dictionary<string, int>();
            itemProperties.Colors.ForEach((color) =>
            {
                if(ColorsDictionary.ContainsKey(color.Palette)) ColorsDictionary[color.Palette].Add(color.Name);
                else ColorsDictionary.Add(color.Palette,new List<string>{color.Name});
            });
            itemProperties.Conditions.ForEach((condition) => ConditionDictionary[condition.Type] = condition.Rank);
            itemProperties.ClothingSizes.ForEach((size) => ClothingSizes[size.Size] = size.Rank);
        }
    }

    public class ItemColor
    {
        public string Name { get; set; }
        public string Palette { get; set; }
    }

    public class Condition
    {
        public string Type { get; set; }
        public int Rank { get; set; }
    }

    public class ItemSize
    {
        public string Size { get; set; }
        public int Rank { get; set; }
    }
    public class ItemProperties
    {
        public List<ItemColor> Colors{ get; set; }
        public List<Condition> Conditions { get; set; }
        public List<ItemSize> FootwearSizes { get; set; }
        public List<ItemSize> ClothingSizes { get; set; }
    }
}