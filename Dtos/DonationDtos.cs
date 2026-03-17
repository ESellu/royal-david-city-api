namespace RoyalDavidCity.Api.Dtos
{
    public class DonationCreateDto
    {
        public string FullName { get; set; } = null!;
        public string Contact { get; set; } = null!;
        public decimal AmountNle { get; set; }
        public string Purpose { get; set; } = "General Offering / Tithe";
        public string? Message { get; set; }
    }

    public class DonationResponseDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = null!;
    }
}
