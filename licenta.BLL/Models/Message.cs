using System;
using System.ComponentModel.DataAnnotations;

namespace licenta.BLL.Models
{
    public class Message
    {
        [Key]
        public int Id { get; set; }
        public User Sender { get; set; }
        public User Receiver { get; set; }
        public string MessageText { get; set; }
        public DateTime Date { get; set; }
    }
}