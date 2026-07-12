using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class MakeAcademicContextNullableInProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_AcademicContexts_AcademicContextId",
                table: "Projects");

            migrationBuilder.RenameColumn(
                name: "MaxMembers",
                table: "Teams",
                newName: "MaxStudents");

            migrationBuilder.AddColumn<string>(
                name: "InviteCode",
                table: "Teams",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "AcademicContextId",
                table: "Projects",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_AcademicContexts_AcademicContextId",
                table: "Projects",
                column: "AcademicContextId",
                principalTable: "AcademicContexts",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Projects_AcademicContexts_AcademicContextId",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "InviteCode",
                table: "Teams");

            migrationBuilder.RenameColumn(
                name: "MaxStudents",
                table: "Teams",
                newName: "MaxMembers");

            migrationBuilder.AlterColumn<Guid>(
                name: "AcademicContextId",
                table: "Projects",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Projects_AcademicContexts_AcademicContextId",
                table: "Projects",
                column: "AcademicContextId",
                principalTable: "AcademicContexts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
