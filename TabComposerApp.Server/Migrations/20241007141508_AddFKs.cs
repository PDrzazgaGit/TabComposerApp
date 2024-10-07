using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabComposerApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFKs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_AspNetUsers_UserId1",
                schema: "identity",
                table: "Song");

            migrationBuilder.DropIndex(
                name: "IX_Song_UserId1",
                schema: "identity",
                table: "Song");

            migrationBuilder.DropColumn(
                name: "UserId1",
                schema: "identity",
                table: "Song");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                schema: "identity",
                table: "Song",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Song_UserId",
                schema: "identity",
                table: "Song",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Song_AspNetUsers_UserId",
                schema: "identity",
                table: "Song",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_AspNetUsers_UserId",
                schema: "identity",
                table: "Song");

            migrationBuilder.DropIndex(
                name: "IX_Song_UserId",
                schema: "identity",
                table: "Song");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                schema: "identity",
                table: "Song",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "UserId1",
                schema: "identity",
                table: "Song",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Song_UserId1",
                schema: "identity",
                table: "Song",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Song_AspNetUsers_UserId1",
                schema: "identity",
                table: "Song",
                column: "UserId1",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
