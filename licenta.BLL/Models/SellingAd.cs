using System;
using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class SellingAd
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public int UserId { get; set; }
        public Item Item { get; set; }
        public DateTime Date { get; set; }
        public string CityLocation { get; set; }
    }
}