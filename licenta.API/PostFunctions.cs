using Aliencube.AzureFunctions.Extensions.OpenApi.Core.Attributes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using licenta.BLL.DTOs;
using licenta.BLL.Managers;
using licenta.BLL.Helpers;
using licenta.BLL.Models;

namespace licenta.API
{
    public class PostFunctions
    {
        private readonly PostManager _postManager ;

        public PostFunctions(ShopDbContext dbContext)
        {
            _postManager = new PostManager(dbContext);
        }
        [HttpPost]
        
        [FunctionName("GetAllPosts")]
        [OpenApiRequestBody("application/json", typeof(Post))]
        public ActionResult<List<Post>> GetAllUsers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "posts")] HttpRequest req,
            ILogger log)
        {
            try
            {
                return _postManager.GetAllPosts();
            }
            catch (Exception e)
            {
                return new ObjectResult(e)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        [FunctionName("AddPost")]
        [OpenApiOperation("add", "posts")]
        [OpenApiRequestBody("application/json", typeof(AddPostDto))]
        public async Task<ActionResult<string>> AddPost(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "posts")] HttpRequest req,
            ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var addPostData = JsonConvert.DeserializeObject<AddPostDto>(requestBody);

                bool added = await _postManager.AddPost(addPostData);
                if (added)
                    return new OkResult();
                
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

    }

}