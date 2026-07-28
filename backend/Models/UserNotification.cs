namespace backend.Models
{
    public class UserNotification : BaseEntity
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = default!;
        public string Message { get; set; } = default!;
        public bool IsRead { get; set; } = false;
    }
}
