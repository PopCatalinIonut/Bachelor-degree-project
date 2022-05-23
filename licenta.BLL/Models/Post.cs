using System;
using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class Post
    {
        public Post(int id, User seller, Item item, DateTime date, string cityLocation, string description, bool isActive)
        {
            Id = id;
            Seller = seller;
            Item = item;
            Date = date;
            CityLocation = cityLocation;
            Description = description;
            IsActive = isActive;
        }
     public Post(){}
        [Key]
        public int Id { get; set; }
        public User Seller { get; set; }
        [Required]
        public Item Item { get; set; }
        public DateTime Date { get; set; }
        public string CityLocation { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }

}