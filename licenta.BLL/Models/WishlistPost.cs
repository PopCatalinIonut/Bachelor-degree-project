using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace licenta.BLL.Models
{
    public class WishlistPost
    {

        [Required]
        [ForeignKey("Post")]
        public int PostId { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }
    }
}
