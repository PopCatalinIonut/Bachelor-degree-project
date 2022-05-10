using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mime;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;

namespace licenta.BLL.Managers
{
    public class PostManager
    {
        private readonly ShopDbContext _context;
        public PostManager(ShopDbContext context)
        {
            _context = context;
        }
        public async Task<bool> AddPost(AddPostDto itemToAdd)
        {
            var dir = Path.GetFullPath(@"..\..\..\..\") + "appsettings.json";
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
            
            var post = DtoConverter.convertFromAddPostDtoToPost(itemToAdd);
            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            if (post.Id == 0) return false;
            
            var itemId = post.Item.Id;
            var itemImages = new List<ItemImage>();
            var imageCount = itemToAdd.Item.Images.Count;
            for(var i=0;i< imageCount;i++)
            {
                    
                var encodedImage =  itemToAdd.Item.Images[i].Split(',')[1];
                var decodedImage = Convert.FromBase64String(encodedImage);
                    
                var imageName = "item" + itemId + "_" + i + "of" + imageCount + ".jpeg";
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
            return true;

        }
    }
}