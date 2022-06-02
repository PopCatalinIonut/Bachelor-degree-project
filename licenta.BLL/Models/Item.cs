using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace licenta.BLL.Models
{
    public class Item: ICloneable
    {
        public Item(int id, string name, string brand, string type, string category, string genre, string size,
            string fit, string condition, double price, List<ItemImage> images, ColorSchema itemColorSchema)
        {
            Id = id;
            Name = name;
            Brand = brand;
            Type = type;
            Category = category;
            Genre = genre;
            Size = size;
            Fit = fit;
            Condition = condition;
            Price = price;
            Images = images;
            ColorSchema = itemColorSchema;
        }

        public Item(Item other)
        {
            Id = other.Id;
            Name = other.Name;
            Brand = other.Brand;
            Type = other.Type;
            Category = other.Category;
            ColorSchema = other.ColorSchema;
            Genre = other.Genre;
            Size = other.Size;
            Fit = other.Fit;
            Condition = other.Condition;
            Price = other.Price;
            Images = other.Images;
        }
        public Item(){}
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }

        [Required]
        public ColorSchema ColorSchema { get; set; }
        public string Genre { get; set; }
        public string Size { get; set; }
        public string Fit { get; set; }
        public string Condition { get; set; }
        public double Price { get; set; }

        [Required]
        public List<ItemImage> Images { get; set; }
        
        [ForeignKey("Post")]
        public int PostId { get; set; }

        public object Clone()
        {
            return new Item
            {
                Id = Id,
                Name = Name,
                Brand = Brand,
                Type = Type,
                Category = Category,
                ColorSchema = new ColorSchema
                {
                    Colors = ColorSchema.Colors,
                    ContainsCool = ColorSchema.ContainsCool,
                    ContainsWarm = ColorSchema.ContainsWarm,
                    ContainsNonColor = ColorSchema.ContainsNonColor,
                    PredominantPalette = ColorSchema.PredominantPalette,
                    Id = ColorSchema.Id,
                    ItemId = ColorSchema.ItemId
                },
                Genre = Genre,
                Size = Size,
                Fit = Fit,
                Condition = Condition,
                Price = Price,
                Images =Images
            }; 
        }
    }
}