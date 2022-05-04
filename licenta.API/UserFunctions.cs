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
        [OpenApiRequestBody("application/json", typeof(User))]
        public ActionResult<LoginUserDto> VerifyUser(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "users/login")] HttpRequest req,
            ILogger log)
        {
            try
            {
                string requestBody = new StreamReader(req.Body).ReadToEnd();
                var userToVerify = JsonConvert.DeserializeObject<LoginUserDto>(requestBody);
                bool verified =  _userManager.VerifyUser(userToVerify.Username,userToVerify.Password);
                if (verified == false)
                    return new NotFoundResult();
                return userToVerify;
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