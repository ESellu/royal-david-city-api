namespace RoyalDavidCity.Api.Dtos
{
    public class AnnouncementCreateDto
    {
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? LinkUrl { get; set; }
        public DateTime? StartAt { get; set; }
        public DateTime? EndAt { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class AnnouncementResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string? LinkUrl { get; set; }
    }
}
