using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using licenta.BLL.DTOs;
using licenta.BLL.Helpers;
using licenta.BLL.Managers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace licenta.API.Controllers
{
    [ApiController]
    [Route(("outfits"))]
    public class OutfitFunctions : Controller
    {
        private readonly OutfitManager _outfitManager ;

        public OutfitFunctions(ShopDbContext dbContext)
        {
            _outfitManager = new OutfitManager(dbContext);
        }
        [HttpPost]
        public async Task<ActionResult<ReturnedOutfitDto>> GenerateOutfit()
        {
            try
            { var body = HttpContext.Request.Body;
                var requestBody = "";
                using (StreamReader reader 
                       = new StreamReader(body, Encoding.UTF8, true, 1024, true))
                {
                    requestBody = await reader.ReadToEndAsync();
                }

                var data = JsonConvert.DeserializeObject<GenerateOutfitDto>(requestBody);

                var outfit = _outfitManager.StartOutfitGenerator(data);
            
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