using System;
using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace licenta.BLL
{
    public class ShopDbContextFactory : IDesignTimeDbContextFactory<ShopDbContext>
    {
        public ShopDbContext CreateDbContext(string[] args)
        { 
            var dir = Path.GetFullPath(@"..\") + "appsettings.json";
            var config = new ConfigurationBuilder()
                .SetBasePath(Environment.CurrentDirectory)
                .AddNewtonsoftJsonFile(dir)
                .Build();
            
            var providers = config.Providers.AsEnumerable().ToList();
            var key="SQLite";
            var connectionProvider = providers.First();
            connectionProvider.TryGet(key, out var connectionString);
            
            var optionsBuilder = new DbContextOptionsBuilder<ShopDbContext>();
            optionsBuilder.UseSqlite(connectionString);
            return new ShopDbContext(optionsBuilder.Options);
        }
    }
}