using System;
using System.IO;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using licenta.BLL.Models;
using Microsoft.Extensions.Configuration;

namespace licenta.BLL
{
    public class ShopDbContext : DbContext
    {
        
        public DbSet<Message> Messages { get; set; }
        public DbSet<ItemImage> ItemImages { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<User> Users { get; set; }
        
        public DbSet<SellingAd> SellingAdds{ get; set; }
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) { }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>();
            builder.Entity<Item>();
            builder.Entity<SellingAd>();
            builder.Entity<ItemImage>();
            builder.Entity<Message>();
            base.OnModelCreating(builder);
        }
    }
}
