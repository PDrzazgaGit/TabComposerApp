using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabComposerApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class aktualizacja : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tabulature_Song_SongId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.DropTable(
                name: "Comment",
                schema: "identity");

            migrationBuilder.DropTable(
                name: "Song",
                schema: "identity");

            migrationBuilder.DropIndex(
                name: "IX_Tabulature_SongId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.DropColumn(
                name: "SongId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                schema: "identity",
                table: "Tabulature",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Tabulature_UserId",
                schema: "identity",
                table: "Tabulature",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tabulature_AspNetUsers_UserId",
                schema: "identity",
                table: "Tabulature",
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
                name: "FK_Tabulature_AspNetUsers_UserId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.DropIndex(
                name: "IX_Tabulature_UserId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.DropColumn(
                name: "UserId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.AddColumn<int>(
                name: "SongId",
                schema: "identity",
                table: "Tabulature",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Song",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Public = table.Column<bool>(type: "bit", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(60)", maxLength: 60, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Song", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Song_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalSchema: "identity",
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comment",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SongId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comment_Song_SongId",
                        column: x => x.SongId,
                        principalSchema: "identity",
                        principalTable: "Song",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tabulature_SongId",
                schema: "identity",
                table: "Tabulature",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_Comment_SongId",
                schema: "identity",
                table: "Comment",
                column: "SongId");

            migrationBuilder.CreateIndex(
                name: "IX_Song_UserId",
                schema: "identity",
                table: "Song",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tabulature_Song_SongId",
                schema: "identity",
                table: "Tabulature",
                column: "SongId",
                principalSchema: "identity",
                principalTable: "Song",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
