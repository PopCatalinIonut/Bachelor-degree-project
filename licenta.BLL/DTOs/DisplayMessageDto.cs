using System;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public class DisplayMessageDto
    {
        public int Id { get; set; }
        public BaseUser Sender { get; set; }
        public BaseUser Receiver { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
    }
}