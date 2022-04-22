using System.Collections.Generic;

namespace licenta.BLL.Models
{
    public class Item
    {
        public string ItemType { get; set; }
        public string ItemCategory { get; set; }
        public string Genre { get; set; }
        public string Size { get; set; }
        public string Fit { get; set; }
        public Condition Condition { get; set; }
        public double Price { get; set; }
        public List<ItemImage> Images { get; set; }
        public string Description { get; set; }
    }
}