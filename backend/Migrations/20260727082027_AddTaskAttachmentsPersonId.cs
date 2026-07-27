using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskAttachmentsPersonId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "DoctorId",
                table: "TaskAttachments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "StudentId",
                table: "TaskAttachments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TaskAttachments_DoctorId",
                table: "TaskAttachments",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_TaskAttachments_StudentId",
                table: "TaskAttachments",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAttachments_Doctors_DoctorId",
                table: "TaskAttachments",
                column: "DoctorId",
                principalTable: "Doctors",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskAttachments_Students_StudentId",
                table: "TaskAttachments",
                column: "StudentId",
                principalTable: "Students",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskAttachments_Doctors_DoctorId",
                table: "TaskAttachments");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskAttachments_Students_StudentId",
                table: "TaskAttachments");

            migrationBuilder.DropIndex(
                name: "IX_TaskAttachments_DoctorId",
                table: "TaskAttachments");

            migrationBuilder.DropIndex(
                name: "IX_TaskAttachments_StudentId",
                table: "TaskAttachments");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "TaskAttachments");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "TaskAttachments");
        }
    }
}
