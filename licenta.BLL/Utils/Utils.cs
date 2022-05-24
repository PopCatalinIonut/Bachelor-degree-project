using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Net.Mime;
using licenta.BLL.Models;
using Newtonsoft.Json;

namespace licenta.BLL.Utils
{
    public static class Utils
    {
        private static Dictionary<string,List<string>> ColorsDictionary { get; set; }
        private static Dictionary<string, int> ConditionDictionary { get; set; }
        private static Dictionary<string, int> FootwearSizes { get; set; }

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
            var pointsOfSimilarity = 0d;
            var totalPointsAvailable = 100d;

            var conditionDifference =
                Math.Abs(ConditionDictionary[firstItem.Condition] - ConditionDictionary[secondItem.Condition]);
            pointsOfSimilarity += conditionDifference == 0 ? 20 : 20 - ((conditionDifference / ConditionDictionary.Count) * 20);
            pointsOfSimilarity += firstItem.Brand == secondItem.Brand ? 5 : 0;

            if (firstItem.Type == "Clothing" && secondItem.Type == "Clothing"){
                var sizeDifference = Math.Abs(ClothingSizes[firstItem.Size] - ClothingSizes[secondItem.Size]);
                var fitDifference = Math.Abs(ClothingSizes[firstItem.Fit] - ClothingSizes[secondItem.Fit]);
                
                totalPointsAvailable += 35;
                pointsOfSimilarity += sizeDifference == 0 ? 15 : 15 - ((sizeDifference/ ClothingSizes.Count) * 15);
                pointsOfSimilarity += fitDifference == 0 ? 20 : 20 - ((fitDifference / ClothingSizes.Count) * 20);
            }

            pointsOfSimilarity += firstItem.Genre == secondItem.Genre ? 30 : 0;
            pointsOfSimilarity += 45 * CalculateColorSchemaSimilarity(firstItem.ColorSchema, secondItem.ColorSchema);
            return pointsOfSimilarity/totalPointsAvailable;
        }

        public static Post CalculateDiffsForPost(Post p, List<Post> posts)
        {
            var over7 = 0;
            var random = new Random();
            var diffs = new Dictionary<Post,double>();
            posts.ForEach(x =>
            {
                diffs[x] = CalculateSimilarity(p.Item, x.Item);
                if (diffs[x] > 0.75)
                    over7++;
            });
            if (over7 == 0) 
                return diffs.OrderByDescending(x => x.Value).FirstOrDefault().Key;
            var ordered = diffs.OrderByDescending(x => x.Value);
            return ordered.ElementAt(random.Next(0, over7-1)).Key;
        }

        private static double CalculateColorSchemaSimilarity(ColorSchema firstSchema, ColorSchema secondSchema)
        {
            var pointsOfSimilarity = 0;
            var totalPointsAvailable = 15d;

            if(firstSchema.Colors.Count < secondSchema.Colors.Count)
                (firstSchema.Colors , secondSchema.Colors) = (secondSchema.Colors, firstSchema.Colors);
            pointsOfSimilarity += firstSchema.ContainsCool == secondSchema.ContainsCool ? 5 : 0;
            pointsOfSimilarity += firstSchema.ContainsWarm == secondSchema.ContainsWarm ? 5 : 0;
            pointsOfSimilarity += firstSchema.ContainsNonColor == secondSchema.ContainsNonColor ? 5 : 0;
            
            firstSchema.Colors.ForEach((color) =>
            {
                totalPointsAvailable += 10;
                if (secondSchema.Colors.Contains(color))
                    pointsOfSimilarity += 10;
            });
            return pointsOfSimilarity/totalPointsAvailable;
        }
        static Utils()
        {
            string propsFileLocation
                = Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.Parent.Parent.FullName + @"\"+ "ItemProperties.json";
            var text = File.ReadAllText(propsFileLocation);
            var itemProperties = JsonConvert.DeserializeObject<ItemProperties>(text);
            ColorsDictionary = new Dictionary<string, List<string>>();
            ConditionDictionary = new Dictionary<string, int>();
            ClothingSizes = new Dictionary<string, int>();
            FootwearSizes = new Dictionary<string, int>();
            itemProperties.Colors.ForEach((color) =>
            {
                if(ColorsDictionary.ContainsKey(color.Palette))
                    ColorsDictionary[color.Palette].Add(color.Name);
                else ColorsDictionary.Add(color.Palette,new List<string>{color.Name});
            });
            itemProperties.Conditions.ForEach((condition) => ConditionDictionary[condition.Type] = condition.Rank);
            itemProperties.FootwearSizes.ForEach((size) => FootwearSizes[size.Size] = size.Rank);
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