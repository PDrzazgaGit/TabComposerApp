using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabComposerApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class aktualizacja2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.DropColumn(
                name: "Tuning",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.RenameColumn(
                name: "Notes",
                schema: "identity",
                table: "Tabulature",
                newName: "Data");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Data",
                schema: "identity",
                table: "Tabulature",
                newName: "Notes");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                schema: "identity",
                table: "Tabulature",
                type: "nvarchar(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Tuning",
                schema: "identity",
                table: "Tabulature",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");
        }
    }
}
