using System;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public class PostWithUserDetailsDto
    {
        public int Id { get; set; }
        public BaseUser Seller { get; set; }
        public Item Item { get; set; }
        public DateTime Date { get; set; }
        public string CityLocation { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}