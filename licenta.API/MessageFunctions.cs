using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Aliencube.AzureFunctions.Extensions.OpenApi.Core.Attributes;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Managers;
using licenta.BLL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;

namespace licenta.API
{
    public class MessageFunctions
    {
        private readonly MessageManager _messageManager ;

        public MessageFunctions(ShopDbContext dbContext)
        {
            _messageManager = new MessageManager(dbContext);
        }
        
        
        [HttpPost]
        [FunctionName("SendMessage")]
        [OpenApiRequestBody("application/json", typeof(SendMessageDto))]
        public async Task<ActionResult<DisplayMessageDto>> SendMessage(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "messages")] HttpRequest req,
            ILogger log)
        {
            try
            { 
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var addMessageData = JsonConvert.DeserializeObject<SendMessageDto>(requestBody);
               
                var added = _messageManager.SendMessage(addMessageData);
                if (added != null)
                    return added;
                
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
        
        [FunctionName("GetUserMessages")]
        [OpenApiParameter("userId", In = ParameterLocation.Path, Required = true, Type = typeof(int))]
        public ActionResult<List<UserConversationDto>> GetUserMessages(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "messages/{userId}")] HttpRequest req, int userId,
            ILogger log)
        {
            try
            {
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