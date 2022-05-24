using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Aliencube.AzureFunctions.Extensions.OpenApi.Core.Attributes;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Managers;
using licenta.BLL.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace licenta.API
{
    public class OutfitFunctions
    {
        private readonly OutfitManager _outfitManager ;

        public OutfitFunctions(ShopDbContext dbContext)
        {
            _outfitManager = new OutfitManager(dbContext);
        }
        [FunctionName("GenerateOutfit")]
        [OpenApiRequestBody("application/json", typeof(AddPostDto))]
        public async Task<ActionResult<ReturnedOutfitDto>> GenerateOutfit(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "outfits")] HttpRequest req,
            ILogger log)
        {
            try
            {
                var requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var data = JsonConvert.DeserializeObject<GenerateOutfitDto>(requestBody);

                var outfit = _outfitManager.GenerateOutfit(data);
            
                return outfit;
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