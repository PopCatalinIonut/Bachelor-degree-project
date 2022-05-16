using System;
using System.Collections.Generic;
using System.Linq;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;

namespace licenta.BLL.Managers
{
    public class MessageManager
    {
        private readonly ShopDbContext _context;
        public MessageManager(ShopDbContext context)
        {
            _context = context;
        }

        public bool SendMessage(SendMessageDto addPostData)
        {
            var sender = _context.Users.FirstOrDefault(x => x.Id == addPostData.SenderId);
            var receiver = _context.Users.FirstOrDefault(x => x.Id == addPostData.ReceiverId);
            if (sender == null || receiver == null) return false;
            var messageToAdd = new Message
            {
                Date = DateTime.Now,
                MessageText = addPostData.Text,
                Receiver = receiver,
                Sender = sender
            };
            _context.Messages.Add(messageToAdd);
            _context.SaveChangesAsync();
            return true;
        }

        public List<DisplayMessageDto> GetUserMessages(int userId)
        {
            var messages = _context.Messages.Where(x => x.Receiver.Id == userId || x.Sender.Id == userId)
                .ToList();

            return messages.Select(DtoConverter.ConvertMessageToDisplayMessageDto).ToList();
        }
    }
}