using System;
using System.Collections.Generic;
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
                Price = itemToConvert.Price
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
            return new DisplayMessageDto
            {
                Date = message.Date,
                Id = message.Id,
                Receiver = message.Receiver,
                Sender = message.Sender,
                Text = message.MessageText
            };
        }
        
    }
}