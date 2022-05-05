using Aliencube.AzureFunctions.Extensions.OpenApi.Core.Attributes;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using System.Web.Http;
using licenta.BLL;
using licenta.BLL.Managers;
using licenta.BLL.Models;
using licenta.BLL.DTOs;

namespace licenta.API
{
    public class UserFunctions
    {
        private readonly UserManager _userManager;

        public UserFunctions(ShopDbContext dbContext)
        {
            _userManager = new UserManager(dbContext);
        }
        [FunctionName("GetUsers")]
        [OpenApiRequestBody("application/json", typeof(User))]
        public ActionResult<List<User>> GetAllUsers(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users")] HttpRequest req,
            ILogger log)
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
        [FunctionName("AddUser")]
        [OpenApiOperation("add", "users")]
        [OpenApiRequestBody("application/json", typeof(User))]
        public ActionResult<User> AddUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "users")] HttpRequest req,
            ILogger log)
        {
            try
            {
                string requestBody = new StreamReader(req.Body).ReadToEnd();
                var addUserData = JsonConvert.DeserializeObject<User>(requestBody);
                return _userManager.AddUser(addUserData);
            }
            catch (Exception e)
            {
                return new ObjectResult(e)
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
        [FunctionName("VerifyUser")]
        [OpenApiOperation("get", "user")]
        [OpenApiRequestBody("application/json", typeof(UserDetailsDto))]
        public ActionResult<UserDetailsDto> VerifyUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/login&username={username}&password={password}")] HttpRequest req,
            [FromUri] string username, [FromUri]string password, ILogger log)
        {
            try
            {
                User verified =  _userManager.VerifyUser(username,password);
                if (verified == null)
                    return new NotFoundResult();
                return new UserDetailsDto {
                    Username = verified.LoginUsername,
                    FirstName = verified.FirstName, 
                    LastName = verified.LastName, 
                    Email = verified.Email
                };
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