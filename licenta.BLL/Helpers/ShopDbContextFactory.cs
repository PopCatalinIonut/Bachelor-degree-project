using System;
using System.IO;
using System.Linq;
using licenta.BLL.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace licenta.BLL.Helpers
{
    public class ShopDbContextFactory : IDesignTimeDbContextFactory<ShopDbContext>
    {
        public ShopDbContext CreateDbContext(string[] args)
        { 
           
            var dir = Path.GetFullPath(@"..\") + "appsettings.json";
            if(args.Length > 0 && args[0] == "Dummy")
                dir = Path.GetFullPath(@"..\..\..\..\licenta.API\")  + "appsettings.json";
            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddNewtonsoftJsonFile(dir)
                .Build();
            
            var providers = config.Providers.AsEnumerable().ToList();
            var connectionProvider = providers.First();
            connectionProvider.TryGet("SQLite", out var connectionString);
            
            var optionsBuilder = new DbContextOptionsBuilder<ShopDbContext>();
            optionsBuilder.UseSqlite(connectionString);
            
            return new ShopDbContext(optionsBuilder.Options);
        }
    }
}