using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUserNotificationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRead",
                table: "UserNotifications");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "UserNotifications");

            migrationBuilder.AddColumn<Guid>(
                name: "ProjectId",
                table: "UserNotifications",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserNotifications_ProjectId",
                table: "UserNotifications",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserNotifications_Projects_ProjectId",
                table: "UserNotifications",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserNotifications_Projects_ProjectId",
                table: "UserNotifications");

            migrationBuilder.DropIndex(
                name: "IX_UserNotifications_ProjectId",
                table: "UserNotifications");

            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "UserNotifications");

            migrationBuilder.AddColumn<bool>(
                name: "IsRead",
                table: "UserNotifications",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "UserNotifications",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
