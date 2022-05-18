using System;
using System.Collections.Generic;
using System.Linq;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;
using Microsoft.EntityFrameworkCore;

namespace licenta.BLL.Managers
{
    public class MessageManager
    {
        private readonly ShopDbContext _context;
        public MessageManager(ShopDbContext context)
        {
            _context = context;
        }

        public DisplayMessageDto SendMessage(SendMessageDto addPostData)
        {
            var sender = _context.Users.FirstOrDefault(x => x.Id == addPostData.SenderId);
            var receiver = _context.Users.FirstOrDefault(x => x.Id == addPostData.ReceiverId);
            if (sender == null || receiver == null) return null;
            var messageToAdd = new Message
            {
                Date = DateTime.Now,
                MessageText = addPostData.Text,
                Receiver = receiver,
                Sender = sender
            };
            _context.Messages.Add(messageToAdd);
            _context.SaveChangesAsync();
            return new DisplayMessageDto
            {
                Id = messageToAdd.Id,
                Date = messageToAdd.Date.ToString("dd-MM-yyyy HH:mm:ss"),
                Receiver =  new BaseUser{FirstName = messageToAdd.Receiver.FirstName, Id = messageToAdd.Receiver.Id, LastName = messageToAdd.Receiver.LastName},
                Sender = new BaseUser{FirstName = messageToAdd.Sender.FirstName, Id = messageToAdd.Sender.Id, LastName = messageToAdd.Sender.LastName},
                Text = messageToAdd.MessageText,
            };
        }

        public List<UserConversationDto> GetUserMessages(int userId)
        {
            var messages = _context.Messages.Where(x => x.Receiver.Id == userId || x.Sender.Id == userId)
                .Include(x => x.Receiver).Include(x => x.Sender)
                .ToList();
            
            var displayMessages = new List<UserConversationDto>();
            foreach (var msg in messages)
            {
                var exists = displayMessages.FindIndex(x =>
                    x.recipient.Id == msg.Sender.Id || x.recipient.Id == msg.Receiver.Id);
                if(exists != -1)
                    displayMessages[exists].messages.Add( DtoConverter.ConvertMessageToDisplayMessageDto(msg));
                else
                {
                    var messageDtos = new List<DisplayMessageDto> { DtoConverter.ConvertMessageToDisplayMessageDto(msg) };
                    displayMessages.Add(new UserConversationDto
                        {
                            messages= messageDtos,
                            recipient = new BaseUser
                            {
                                FirstName = msg.Sender.Id != userId ? msg.Sender.FirstName : msg.Receiver.FirstName,
                                LastName = msg.Sender.Id != userId ? msg.Sender.LastName : msg.Receiver.LastName,
                                Id = msg.Sender.Id != userId ? msg.Sender.Id : msg.Receiver.Id
                            }
                        }
                    );
                }
            }
            return displayMessages;
        }
    }
}