using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace licenta.API.Controllers
{
    [ApiController]
    public class MessageFunctions : Controller
    {
        private readonly MessageManager _messageManager ;
        private readonly ChatHub _chatHub;
        public MessageFunctions(ShopDbContext dbContext, ChatHub chatHub)
        {
            _messageManager = new MessageManager(dbContext);
            _chatHub = chatHub;
        }
        
       [HttpPost]
       [Route("messages")]
        public async Task<ActionResult<DisplayMessageDto>> SendMessage()
        {
            try
            {   
                var body = HttpContext.Request.Body;
                var requestBody = "";
                using (StreamReader reader 
                       = new StreamReader(body, Encoding.UTF8, true, 1024, true))
                {
                    requestBody = await reader.ReadToEndAsync();
                }
                
                var addMessageData = JsonConvert.DeserializeObject<SendMessageDto>(requestBody);
               
                var added = _messageManager.SendMessage(addMessageData);
                if (added != null)
                {
                    var isReceiverLogged =
                        _chatHub.ConnectedClients.TryGetValue(added.Receiver.Id, out var receiverConnectionId);
                    if (isReceiverLogged)
                        _chatHub.SendMessage(receiverConnectionId, "ReceiveMessage", added);
                    return added;
                }
                
                var result = new ObjectResult(false)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
                return result;
            }
            catch (Exception e)
            {
                return new ObjectResult(e)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        
        [HttpGet]
        [Route("messages/userId={userId}&connectionId={connectionId}")]
        public async Task<ActionResult<List<UserConversationDto>>> GetUserMessages(int userId, string connectionId)
        {
            try
            {
                if (!_chatHub.ConnectedClients.ContainsKey(userId))
                    _chatHub.ConnectedClients.Add(userId, connectionId);
                else _chatHub.ConnectedClients[userId] = connectionId;
                return _messageManager.GetUserMessages(userId);
            }
            catch (Exception e)
            {
                return new ObjectResult(e)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }
}