using Microsoft.EntityFrameworkCore.Migrations;

namespace licenta.BLL.Migrations
{
    public partial class Brandupdateonitem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "Items",
                type: "TEXT",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Items");
        }
    }
}
