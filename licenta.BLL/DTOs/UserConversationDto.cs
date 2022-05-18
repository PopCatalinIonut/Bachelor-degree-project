using System.Collections.Generic;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public class UserConversationDto
    {
        public List<DisplayMessageDto> messages { get; set; }
        public BaseUser recipient { get; set; }
    }
}