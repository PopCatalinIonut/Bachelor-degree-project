namespace licenta.BLL.DTOs
{
    public class GenerateOutfitDto
    {
        public int UserId { get; set; }
        public int PostId { get; set; }
        public string Brand { get; set; }
        public string Season { get; set; }
        public string ShoeSize { get; set; }
        public string ClothingSize { get; set; }
        public int MaximumValue { get; set; }
        public string Genre { get; set; }
        public string ColorPalette { get; set; }
    }
}