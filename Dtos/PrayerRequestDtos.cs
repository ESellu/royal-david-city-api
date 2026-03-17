namespace RoyalDavidCity.Api.Dtos
{
    public class PrayerRequestCreateDto
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string Category { get; set; } = "Other";
        public string Message { get; set; } = null!;
        public bool Confidential { get; set; } = true;
    }

    public class PrayerRequestResponseDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = null!;
    }
}
