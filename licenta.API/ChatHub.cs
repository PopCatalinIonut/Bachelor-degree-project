using System.Collections.Generic;
using licenta.BLL.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace licenta.API
{
    public class ChatHub : Hub
    {
        public Dictionary<int, string> ConnectedClients { get; set; } = new();
        
        public string GetConnectionId() => Context.ConnectionId;

        public async void SendMessage(string receiverConnectionId, string methodName, DisplayMessageDto added)
        {
            await Clients.Client(receiverConnectionId).SendAsync(methodName,added);
        }
    }
}