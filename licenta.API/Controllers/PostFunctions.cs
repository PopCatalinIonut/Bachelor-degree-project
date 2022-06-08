using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Managers;
using licenta.BLL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace licenta.API.Controllers
{
    [ApiController]
    [Route("posts")]
    public class PostFunctions : Controller
    {
        private readonly PostManager _postManager ;

        public PostFunctions(ShopDbContext dbContext)
        {
            _postManager = new PostManager(dbContext);
        }
        
        [HttpPost]
        [Route("/wishlist")]
        public async Task<ActionResult<Post>> AddPostToWishlist()
        {
            try
            { 
                var body = HttpContext.Request.Body;
                var requestBody = "";
                using (StreamReader reader 
                       = new StreamReader(body, Encoding.UTF8, true, 1024, true))
                {
                    requestBody = await reader.ReadToEndAsync();
                }

                var addPostData = JsonConvert.DeserializeObject<WishlistPost>(requestBody);
               
                var added = _postManager.AddPostToWishlist(addPostData);
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
        
        [HttpDelete]
        [Route("/wishlist/post={postId}&user={userId}")]
        public ActionResult<Post> RemovePostFromWishlist(int postId, int userId)
        {
            try
            { 
                var removePostData = new WishlistPost { PostId = postId, UserId = userId };
               
                var removed = _postManager.RemovePostFromWishlist(removePostData);
                if (removed)
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
        
        [HttpPatch]
        [Route("/posts/post={postId}&status={status}")]
        public ActionResult<Post> UpdatePostStatus(int postId, bool status)
        {
            try
            { 
                var updated = _postManager.UpdateActiveStatus(postId, status);
                if (updated)
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
        
        [HttpDelete]
        [Route("/posts/{postId}")]
        public ActionResult<Post> DeletePost(int postId)
        {
            try
            { 
                var deleted = _postManager.DeletePost(postId);
                if (deleted)
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
        
        [HttpGet]
        public ActionResult<List<Post>> GetActivePosts()
        {
            try
            {
                return _postManager.GetActivePosts();
            }
            catch (Exception e)
            {
                return new ObjectResult(e)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        [HttpPost]
        public async Task<ActionResult<Post>> AddPost()
        {
            try
            {
                var body = HttpContext.Request.Body;
                var requestBody = "";
                using (StreamReader reader 
                       = new StreamReader(body, Encoding.UTF8, true, 1024, true))
                {
                    requestBody = await reader.ReadToEndAsync();
                }
                var addPostData = JsonConvert.DeserializeObject<AddPostDto>(requestBody);

                var added = await _postManager.AddPost(addPostData);
                if(added == null)
                    return new ObjectResult("Cannot be added")
                    {
                        StatusCode = StatusCodes.Status500InternalServerError
                    };
                return added;
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