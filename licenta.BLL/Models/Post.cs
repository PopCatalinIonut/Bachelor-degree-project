using System;
using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class Post
    {
        [Key]
        public int Id { get; set; }
        public User Seller { get; set; }
        public Item Item { get; set; }
        public DateTime Date { get; set; }
        public string CityLocation { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }

}