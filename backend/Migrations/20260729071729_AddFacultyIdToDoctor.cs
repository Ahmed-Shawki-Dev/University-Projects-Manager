using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFacultyIdToDoctor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FacultyId",
                table: "Doctors",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_FacultyId",
                table: "Doctors",
                column: "FacultyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Doctors_Faculties_FacultyId",
                table: "Doctors",
                column: "FacultyId",
                principalTable: "Faculties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctors_Faculties_FacultyId",
                table: "Doctors");

            migrationBuilder.DropIndex(
                name: "IX_Doctors_FacultyId",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "FacultyId",
                table: "Doctors");
        }
    }
}
