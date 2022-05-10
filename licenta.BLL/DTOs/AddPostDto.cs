namespace licenta.BLL.DTOs
{
    public class AddPostDto
    {
        public int UserId { get; set; }
        public AddItemDto Item { get; set; }
        public string CityLocation { get; set; }
        public string Description { get; set; }
    }
}