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
    [Route("users")]
    public class UserFunctions : Controller
    {
        private readonly UserManager _userManager;
        
        public UserFunctions(ShopDbContext dbContext)
        {
            _userManager = new UserManager(dbContext);
        }
        [HttpGet]
        public ActionResult<List<User>> GetAllUsers()
        {
            try
            {
                return _userManager.GetAllUsers();
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
        public async Task<ActionResult<string>> AddUser()
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

                var addUserData = JsonConvert.DeserializeObject<User>(requestBody);
                var message = _userManager.AddUser(addUserData);
                if (message.Length == 0)
                    return new OkResult();
                
                var result = new ObjectResult(message)
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
        [Route("login&username={username}&password={password}")]
        public ActionResult<UserWithWishlistDto> VerifyUser(string username, string password)
        {
            try
            {
                UserWithWishlistDto verified =  _userManager.VerifyUser(username,password);
                if (verified == null)
                    return new NotFoundResult();
                JsonConvert.SerializeObject(verified, new JsonSerializerSettings(){
                    PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                    Formatting = Formatting.Indented
                });
                return verified;
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