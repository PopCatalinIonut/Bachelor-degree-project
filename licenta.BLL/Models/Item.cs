﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class Item
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public string Genre { get; set; }
        public string Size { get; set; }
        public string Fit { get; set; }
        public Condition Condition { get; set; }
        public double Price { get; set; }
        public List<ItemImage> Images { get; set; }
    }
}