using System;
using System.Collections.Generic;
using System.IO;
using licenta.BLL.Helpers;
using licenta.BLL.Managers;
using licenta.BLL.Models;
using Newtonsoft.Json;

namespace DummyDataFiller
{
    internal static class DummyStartUp
    {
        static void Main(string[] args)
        {
            var factory = new ShopDbContextFactory();
            var dbargs = new string[1];
            dbargs[0] = "Dummy";
            var context = factory.CreateDbContext(dbargs);
            var userManager = new UserManager(context);
            
            var dir = Path.GetFullPath(@"..\..\..\")  + "dummyData.json";
            var text = File.ReadAllText(dir);

            var users = JsonConvert.DeserializeObject<UsersJsonData>(text);
            users.Users.ForEach(x => userManager.AddUser(x));
        }
    }

    internal class UsersJsonData
    {
        [JsonProperty("users")]
        public List<User> Users;
    }
}