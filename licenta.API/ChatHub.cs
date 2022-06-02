using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;

namespace licenta.API
{
    public class ChatHub : Hub
    {
        public Dictionary<int, string> ConnectedClients { get; set; } = new Dictionary<int, string>();
        
        public string GetConnectionId() => Context.ConnectionId;
    }
}