using System;
using System.Collections.Generic;
using System.Linq;
using licenta.BLL.Models;
namespace licenta.BLL.DTOs
{
    public static class DtoConverter
    {
        public static Item ConvertFromAddItemDtoToItem(AddItemDto itemToConvert)
        {
            return new Item
            {
                Category = itemToConvert.Category,
                Condition = itemToConvert.Condition,
                Fit = itemToConvert.Fit,
                Genre = itemToConvert.Genre,
                Images = new List<ItemImage>(),
                Name = itemToConvert.Name,
                Size = itemToConvert.Size,
                Type = itemToConvert.Type,
                Price = itemToConvert.Price,
                Brand = itemToConvert.Brand,
                ColorSchema = Utils.Utils.CalculateItemColorSchema(itemToConvert.Colors)
            };
        }

        public static Post ConvertFromAddPostDtoToPost(AddPostDto postToAdd)
        {
            return new Post
            {
                CityLocation = postToAdd.CityLocation,
                Date = DateTime.Now,
                Description = postToAdd.Description,
                Seller = new User
                {
                    Email = "",
                    FirstName = "",
                    Id = postToAdd.UserId,
                    LastName = "",
                    LoginUsername = "",
                    Password = ""
                },
                Item = ConvertFromAddItemDtoToItem(postToAdd.Item),
                IsActive = true
            };
        }

        public static PostWithUserDetailsDto ConvertPostToPostWithUserDetailsDto(Post post)
        {
            PostWithUserDetailsDto newPost = new PostWithUserDetailsDto
            {
                CityLocation = post.CityLocation,
                Date = post.Date,
                Description = post.Description,
                Id = post.Id,
                IsActive = post.IsActive,
                Item = post.Item,
                Seller = new BaseUser
                {
                    FirstName = post.Seller.FirstName,
                    Id = post.Seller.Id,
                    LastName = post.Seller.LastName
                }
            };
            return newPost;
        }

        public static List<PostWithUserDetailsDto> ConvertPostsToPostsWithUserDetailsDto(List<Post> posts)
        {
            List<PostWithUserDetailsDto> postList = new List<PostWithUserDetailsDto>();
            foreach (var post in posts)
            {
                postList.Add(ConvertPostToPostWithUserDetailsDto(post));
            }
            return postList;
        }

        public static DisplayMessageDto ConvertMessageToDisplayMessageDto(Message message)
        {
            var newMessage =  new DisplayMessageDto
            {
                Date = message.Date.ToString("dd-MM-yyyy HH:mm:ss"),
                Id = message.Id,
                Receiver = new BaseUser{ FirstName = message.Receiver.FirstName, Id = message.Receiver.Id, LastName = message.Receiver.LastName},
                Sender = new BaseUser{ FirstName = message.Sender.FirstName, Id = message.Sender.Id, LastName = message.Sender.LastName},
                Text = message.MessageText
            };
            return newMessage;
        }

        public static ReturnedOutfitDto ConvertOutfitToReturnedOutfitDto(Outfit outfit)
        {
            var components = outfit.Components
                .Select(entry => new OutfitComponent(entry.Key, entry.Value)).ToList();

            return new ReturnedOutfitDto { Components = components };
        }
        
    }
}