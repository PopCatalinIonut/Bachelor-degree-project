// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using licenta.BLL.Helpers;

namespace licenta.BLL.Migrations
{
    [DbContext(typeof(ShopDbContext))]
    [Migration("20220521180407_Initialmigration")]
    partial class Initialmigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.16");

            modelBuilder.Entity("licenta.BLL.Models.ColorSchema", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Colors")
                        .HasColumnType("TEXT");

                    b.Property<bool>("ContainsCool")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("ContainsNonColor")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("ContainsWarm")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("PredominantPalette")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ItemId")
                        .IsUnique();

                    b.ToTable("ColorSchemas");
                });

            modelBuilder.Entity("licenta.BLL.Models.Item", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Brand")
                        .HasColumnType("TEXT");

                    b.Property<string>("Category")
                        .HasColumnType("TEXT");

                    b.Property<string>("Condition")
                        .HasColumnType("TEXT");

                    b.Property<string>("Fit")
                        .HasColumnType("TEXT");

                    b.Property<string>("Genre")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("PostId")
                        .HasColumnType("INTEGER");

                    b.Property<double>("Price")
                        .HasColumnType("REAL");

                    b.Property<string>("Size")
                        .HasColumnType("TEXT");

                    b.Property<string>("Type")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("PostId")
                        .IsUnique();

                    b.ToTable("Items");
                });

            modelBuilder.Entity("licenta.BLL.Models.ItemImage", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ItemId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Link")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ItemId");

                    b.ToTable("ItemImages");
                });

            modelBuilder.Entity("licenta.BLL.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("MessageText")
                        .HasColumnType("TEXT");

                    b.Property<int?>("ReceiverId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SenderId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ReceiverId");

                    b.HasIndex("SenderId");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("licenta.BLL.Models.Post", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("CityLocation")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsActive")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SellerId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("SellerId");

                    b.ToTable("Posts");
                });

            modelBuilder.Entity("licenta.BLL.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Email")
                        .HasColumnType("TEXT");

                    b.Property<string>("FirstName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LastName")
                        .HasColumnType("TEXT");

                    b.Property<string>("LoginUsername")
                        .HasColumnType("TEXT");

                    b.Property<string>("Password")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("licenta.BLL.Models.WishlistPost", b =>
                {
                    b.Property<int>("PostId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("UserId")
                        .HasColumnType("INTEGER");

                    b.HasKey("PostId", "UserId");

                    b.HasIndex("UserId");

                    b.ToTable("WishlistPosts");
                });

            modelBuilder.Entity("licenta.BLL.Models.ColorSchema", b =>
                {
                    b.HasOne("licenta.BLL.Models.Item", null)
                        .WithOne("ColorSchema")
                        .HasForeignKey("licenta.BLL.Models.ColorSchema", "ItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("licenta.BLL.Models.Item", b =>
                {
                    b.HasOne("licenta.BLL.Models.Post", null)
                        .WithOne("Item")
                        .HasForeignKey("licenta.BLL.Models.Item", "PostId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("licenta.BLL.Models.ItemImage", b =>
                {
                    b.HasOne("licenta.BLL.Models.Item", null)
                        .WithMany("Images")
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("licenta.BLL.Models.Message", b =>
                {
                    b.HasOne("licenta.BLL.Models.User", "Receiver")
                        .WithMany()
                        .HasForeignKey("ReceiverId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("licenta.BLL.Models.User", "Sender")
                        .WithMany()
                        .HasForeignKey("SenderId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Receiver");

                    b.Navigation("Sender");
                });

            modelBuilder.Entity("licenta.BLL.Models.Post", b =>
                {
                    b.HasOne("licenta.BLL.Models.User", "Seller")
                        .WithMany("PostedPosts")
                        .HasForeignKey("SellerId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("Seller");
                });

            modelBuilder.Entity("licenta.BLL.Models.WishlistPost", b =>
                {
                    b.HasOne("licenta.BLL.Models.User", null)
                        .WithMany("WishlistList")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("licenta.BLL.Models.Item", b =>
                {
                    b.Navigation("ColorSchema")
                        .IsRequired();

                    b.Navigation("Images");
                });

            modelBuilder.Entity("licenta.BLL.Models.Post", b =>
                {
                    b.Navigation("Item")
                        .IsRequired();
                });

            modelBuilder.Entity("licenta.BLL.Models.User", b =>
                {
                    b.Navigation("PostedPosts");

                    b.Navigation("WishlistList");
                });
#pragma warning restore 612, 618
        }
    }
}
