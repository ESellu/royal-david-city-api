namespace RoyalDavidCity.Api.Dtos
{
    public class ContactMessageCreateDto
    {
        public string Name { get; set; } = null!;
        public string Contact { get; set; } = null!;
        public string SubjectType { get; set; } = "General Enquiry";
        public string Message { get; set; } = null!;
    }

    public class ContactMessageResponseDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = null!;
    }
}
