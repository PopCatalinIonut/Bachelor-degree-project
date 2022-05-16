namespace licenta.BLL.DTOs
{
    public class SendMessageDto
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Text { get; set; }
    }
}