using System;
using System.IO;
using System.Linq;
using licenta.BLL.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace licenta.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration) { Configuration = configuration; }
        private IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services) {
            var dir = Path.GetFullPath(@".\") + "appsettings.json";
            IConfigurationRoot config = new ConfigurationBuilder().SetBasePath(Environment.CurrentDirectory)
                .AddNewtonsoftJsonFile(dir).Build();

            services.AddControllers().AddNewtonsoftJson(options => {
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });

            var providers = config.Providers.AsEnumerable().ToList();
            var connectionProvider = providers.First();
            connectionProvider.TryGet("SQLite", out var connectionString);
            
            services.AddCors(options => {
                options.AddPolicy("ClientPermission", policy => {
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000").AllowCredentials();
                });
            });
            services.AddSingleton<ChatHub>();
            services.AddSignalR();
            services.AddControllersWithViews();
            services.AddDbContext<ShopDbContext>(options => options.UseSqlite(connectionString));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints => {
                endpoints.MapControllers(); 
                endpoints.MapHub<ChatHub>("/hubs/chat");
            });
            app.UseCors("ClientPermission");
        }
    }
}