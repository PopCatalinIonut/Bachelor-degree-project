using System;
using System.Collections.Generic;
using licenta.BLL.Models;

namespace licenta.BLL.DTOs
{
    public static class DtoConverter
    {
        public static Item convertFromAddItemDtoToItem(AddItemDto itemToConvert)
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

        public static Post convertFromAddPostDtoToPost(AddPostDto postToAdd)
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
                Item = convertFromAddItemDtoToItem(postToAdd.Item),
                IsActive = true
            };

        }
    }
}