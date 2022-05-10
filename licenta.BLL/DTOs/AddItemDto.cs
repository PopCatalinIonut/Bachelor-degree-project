using System.Collections.Generic;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public class AddItemDto
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string Category { get; set; }
        public string Genre { get; set; }
        public string Size { get; set; }
        public string Fit { get; set; }
        public Condition Condition { get; set; }
        public double Price { get; set; }
        public List<string> Images { get; set; }
    }
}