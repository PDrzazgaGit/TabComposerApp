using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TabComposerApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class ConfigureDB3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tablature_AspNetUsers_UserId",
                schema: "identity",
                table: "Tablature");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tablature",
                schema: "identity",
                table: "Tablature");

            migrationBuilder.RenameTable(
                name: "Tablature",
                schema: "identity",
                newName: "Tablatures",
                newSchema: "identity");

            migrationBuilder.RenameIndex(
                name: "IX_Tablature_UserId",
                schema: "identity",
                table: "Tablatures",
                newName: "IX_Tablatures_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tablatures",
                schema: "identity",
                table: "Tablatures",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tablatures_AspNetUsers_UserId",
                schema: "identity",
                table: "Tablatures",
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
                name: "FK_Tablatures_AspNetUsers_UserId",
                schema: "identity",
                table: "Tablatures");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tablatures",
                schema: "identity",
                table: "Tablatures");

            migrationBuilder.RenameTable(
                name: "Tablatures",
                schema: "identity",
                newName: "Tablature",
                newSchema: "identity");

            migrationBuilder.RenameIndex(
                name: "IX_Tablatures_UserId",
                schema: "identity",
                table: "Tablature",
                newName: "IX_Tablature_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tablature",
                schema: "identity",
                table: "Tablature",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tablature_AspNetUsers_UserId",
                schema: "identity",
                table: "Tablature",
                column: "UserId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
