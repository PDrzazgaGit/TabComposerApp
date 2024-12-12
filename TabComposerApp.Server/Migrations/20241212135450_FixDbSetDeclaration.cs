using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabComposerApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class FixDbSetDeclaration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tabulature_AspNetUsers_UserId",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tabulature",
                schema: "identity",
                table: "Tabulature");

            migrationBuilder.RenameTable(
                name: "Tabulature",
                schema: "identity",
                newName: "Tabulatures",
                newSchema: "identity");

            migrationBuilder.RenameIndex(
                name: "IX_Tabulature_UserId",
                schema: "identity",
                table: "Tabulatures",
                newName: "IX_Tabulatures_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tabulatures",
                schema: "identity",
                table: "Tabulatures",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tabulatures_AspNetUsers_UserId",
                schema: "identity",
                table: "Tabulatures",
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
                name: "FK_Tabulatures_AspNetUsers_UserId",
                schema: "identity",
                table: "Tabulatures");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tabulatures",
                schema: "identity",
                table: "Tabulatures");

            migrationBuilder.RenameTable(
                name: "Tabulatures",
                schema: "identity",
                newName: "Tabulature",
                newSchema: "identity");

            migrationBuilder.RenameIndex(
                name: "IX_Tabulatures_UserId",
                schema: "identity",
                table: "Tabulature",
                newName: "IX_Tabulature_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tabulature",
                schema: "identity",
                table: "Tabulature",
                column: "Id");

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
    }
}
