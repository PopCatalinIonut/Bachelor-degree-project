using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class ItemImage
    {
        [Key]
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string Link { get; set; }
    }
}