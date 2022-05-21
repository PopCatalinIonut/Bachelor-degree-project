using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using licenta.BLL.Models;
using Newtonsoft.Json;

namespace licenta.BLL.Utils
{
    public static class Utils
    {
        public static Dictionary<string,List<string>> ColorsDictionary { get; set; }
        public static ColorSchema CalculateItemColorSchema(List<string> colors)
        {
            ColorSchema schema = new ColorSchema(colors);
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

        static Utils()
        {
            string propsFileLocation
                = Directory.GetParent(System.IO.Directory.GetCurrentDirectory()).Parent.Parent.Parent.FullName + @"\"+ "ItemProperties.json";
            var text = File.ReadAllText(propsFileLocation);
            var colorsProps = JsonConvert.DeserializeObject<ColorsProps>(text);
            ColorsDictionary = new Dictionary<string, List<string>>();
            colorsProps.Colors.ForEach((color) =>
            {
                if(ColorsDictionary.ContainsKey(color.Palette))
                    ColorsDictionary[color.Palette].Add(color.Name);
                else ColorsDictionary.Add(color.Palette,new List<string>{color.Name});
            });
            
        }
    }

    public class ColorsProps
    {
        public List<ItemColor> Colors { get; set; }
    }
    public class ItemColor
    {
        public string Name { get; set; }
        public string Palette { get; set; }
    }
}