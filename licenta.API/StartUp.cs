using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using licenta.BLL.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(licenta.API.Startup))]
namespace licenta.API
{
    class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var dir = Path.GetFullPath(@"..\..\..\")  + "appsettings.json";
            IConfigurationRoot config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddNewtonsoftJsonFile(dir)
                .Build();
            
            var providers = config.Providers.AsEnumerable().ToList();
            string key = "SQLite";
            var connectionProvider = providers.First();
            connectionProvider.TryGet(key, out var connectionString);
            
            builder.Services
                .AddDbContext<ShopDbContext>(options => options.UseSqlite(connectionString));
        }
       
    }

}
