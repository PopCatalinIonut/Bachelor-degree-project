using System.Collections.Generic;
using System.Linq;
using licenta.BLL.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace licenta.BLL.Helpers
{
    public class ShopDbContext : DbContext
    {
        public DbSet<Message> Messages { get; set; }
        public DbSet<ItemImage> ItemImages { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts{ get; set; }
        public DbSet<ColorSchema> ColorSchemas { get; set; }
        public DbSet<WishlistPost> WishlistPosts { get; set; }
        public ShopDbContext(DbContextOptions<ShopDbContext> options) : base(options) { }
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>().HasMany(x => x.PostedPosts).WithOne(x => x.Seller);
            builder.Entity<Item>().HasMany(x => x.Images);
            builder.Entity<Item>().HasOne(x => x.ColorSchema);
            builder.Entity<Post>().HasOne(x => x.Item);
            builder.Entity<ItemImage>();
            builder.Entity<Message>();
            builder.Entity<WishlistPost>().HasKey(x => new { x.PostId, x.UserId });
            builder.Entity<ColorSchema>().Property(p => p.Colors)
                .HasConversion(v => JsonConvert.SerializeObject(v), 
                    v => JsonConvert.DeserializeObject<List<string>>(v));
            foreach (var foreignKey in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                foreignKey.DeleteBehavior = DeleteBehavior.Cascade;
            }
            base.OnModelCreating(builder);
        }
    }
}
