using System.Collections.Generic;

namespace licenta.BLL.Models
{
    public class Outfit
    {
        public Dictionary<string,Post> Components = new Dictionary<string, Post>
        {
            ["Footwear"] = null,
            ["Pants"] = null,
            ["Top"] = null
        };

        public Outfit(){}

        public void AddPostToOutfit(Post post) {
            switch (post.Item.Type) {
                case "Footwear": Components["Footwear"] = post;
                    break;
                case "Clothing":
                    switch (post.Item.Category) {
                        case "Shorts" or "Pants":
                            Components["Pants"] = post;
                            break;
                        case "Hoodies" or "T-Shirts" or "Sweatshirts":
                            Components["Top"] = post;
                            break;
                    }
                    break;
            }
        }
    }

    public class OutfitComponent
    {
        public string Type { get; set; }
        public Post Post { get; set; }
        public OutfitComponent(string type, Post post)
        {
            Post = post;
            Type = type;
        }

        public static string GetTypeOfItem(Item item)
        {
            if (item.Type == "Footwear")
                return "Footwear";
            switch (item.Category)
            {
                case "Pants" or "Shorts":
                    return "Pants";
                case "Hoodies":
                case "T-Shirts":
                case "Sweatshirts":
                    return "Top";
            };
             return "";
        }
    }
}