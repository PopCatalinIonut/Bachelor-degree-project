using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;

namespace licenta.BLL.Managers
{
    public class PostManager
    {
        private readonly ShopDbContext _context;
        public PostManager(ShopDbContext context)
        {
            _context = context;
        }
        public async Task<Post> AddPost(AddPostDto itemToAdd)
        {
            
            var post = DtoConverter.ConvertFromAddPostDtoToPost(itemToAdd);
            var user = _context.Users.FirstOrDefault(x => x.Id == post.Seller.Id);
            if (user == null) return null;
            post.Seller = user;
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            if (post.Id == 0) return null;
            
            var dir = Path.GetFullPath(@"..\") + "appsettings.json";
            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddNewtonsoftJsonFile(dir)
                .Build();

            var providers = config.Providers.AsEnumerable().ToList();
            var azureAccountKey="AzureAccountKey";
            var azureAccountName="AzureAccountName";
            var azureBlobStorageName = "AzureBlobStorageName";
            var azureBlobStorageLinkPrefix = "AzureBlobStorageLinkPrefix";
            var connectionProvider = providers.First();
            connectionProvider.TryGet(azureAccountKey, out var accountKey);
            connectionProvider.TryGet(azureAccountName, out var accountName);
            connectionProvider.TryGet(azureBlobStorageName, out var blobStorageName);
            connectionProvider.TryGet(azureBlobStorageLinkPrefix, out var blobStorageLinkPrefix);
            
            var azureBlobStorageLink = blobStorageLinkPrefix + blobStorageName;
            
            StorageCredentials credentials = new StorageCredentials(accountName, accountKey);
            CloudStorageAccount account = new CloudStorageAccount(credentials, true);
            var cloudBlobClient = account.CreateCloudBlobClient();
            var cloudBobContainer = cloudBlobClient.GetContainerReference(blobStorageName); 
            
            var itemId = post.Item.Id;
            var itemImages = new List<ItemImage>();
            var imageCount = itemToAdd.Item.Images.Count;
            for(var i=0;i< imageCount;i++)
            {
                    
                var encodedImage =  itemToAdd.Item.Images[i].Split(',')[1];
                var decodedImage = Convert.FromBase64String(encodedImage);
                int currentImageNr = i + 1;
                var imageName = "item" + itemId + "_" + currentImageNr + "of" + imageCount + ".jpeg";
                var cloudBlockBlob = cloudBobContainer.GetBlockBlobReference(imageName);
                cloudBlockBlob.Properties.ContentType = "image/jpeg";
                Stream stream = new MemoryStream(decodedImage);
                await cloudBlockBlob.UploadFromStreamAsync(stream);

                var imageLink = azureBlobStorageLink + "/" + imageName;
                itemImages.Add(new ItemImage
                {
                    ItemId = itemId,
                    Link = imageLink
                });
            };

            post.Item.Images = itemImages;
            _context.Items.Update(post.Item);
                
            await _context.SaveChangesAsync();
            return new Post(post.Id, new User(post.Seller.Id, post.Seller.FirstName, post.Seller.LastName), post.Item,
                post.Date, post.CityLocation, post.Description, post.IsActive);

        }

        public List<Post> GetActivePosts()
        {
            var posts = _context.Posts.Where(x => x.IsActive == true)
                .Include(x => x.Item)
                .ThenInclude(item => item.Images).Include(x => x.Item.ColorSchema)
                .Select(x => new Post(x.Id,new User(x.Seller.Id,x.Seller.FirstName,x.Seller.LastName),x.Item,x.Date,x.CityLocation,x.Description,x.IsActive)).ToList();
            
            return posts;
        }

        public bool AddPostToWishlist(WishlistPost addPostData)
        {
            var existingUser = _context.Users.FirstOrDefault(x => x.Id == addPostData.UserId);
            var existingPost = _context.Posts.FirstOrDefault(x => x.Id == addPostData.PostId);
            if (existingPost == null || existingUser == null) return false;
            {
                var existingRelation = _context.WishlistPosts.FirstOrDefault(x => x.PostId == addPostData.PostId && x.UserId == addPostData.UserId);
                if (existingRelation != null) 
                    return false;
                     
                _context.WishlistPosts.Add(addPostData);
                _context.SaveChangesAsync();
                return true;
            }

        }

        public bool RemovePostFromWishlist(WishlistPost removePostData)
        {
            var removed = _context.WishlistPosts.Remove(removePostData);
            _context.SaveChangesAsync();
            return removed != null;
        }

        public bool UpdateActiveStatus(int postId, bool newActiveStatus)
        {
            var post = _context.Posts.FirstOrDefault(x => x.Id == postId);
            if (post == null) return false;
            
            post.IsActive = newActiveStatus;
            _context.SaveChangesAsync();
            return true;
        }

        public bool DeletePost(int postId)
        {
            var post = _context.Posts.FirstOrDefault(x => x.Id == postId);
            if (post == null) return false;
            
            _context.Posts.Remove(post);
            _context.SaveChangesAsync();
            return true;

        }
    }
}