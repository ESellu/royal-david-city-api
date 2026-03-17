using Microsoft.EntityFrameworkCore;

namespace RoyalDavidCity.Api.Data
{
    // This class represents your database and tables
    public class RdcdfDbContext : DbContext
    {
        public RdcdfDbContext(DbContextOptions<RdcdfDbContext> options)
            : base(options)

        {
        }

        // One DbSet = one table in the database
        public DbSet<PrayerRequest> PrayerRequests { get; set; } = null!;
        //Donations Table
        public DbSet<DonationPledge> DonationPledges { get; set; } = null!;
        //CONTACT TABLE
        public DbSet<ContactMessage> ContactMessages { get; set; } = null!;
        //Announcement 
        public DbSet<Announcement> Announcements { get; set; } = null!;


    }

    // Simple entity for now (one table)
    public class PrayerRequest
    {
        public int Id { get; set; }

        public string Name { get; set; } = "Anonymous";

        public string? Phone { get; set; }

        public string Category { get; set; } = "Other";

        public string Message { get; set; } = null!;

        public bool Confidential { get; set; }

        public string Status { get; set; } = "NEW"; // NEW, PRAYED_FOR, etc.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class DonationPledge
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Contact { get; set; } = null!; // phone or email

        public decimal AmountNle { get; set; }

        public string Purpose { get; set; } = "General Offering / Tithe";

        public string? Message { get; set; }

        public string Status { get; set; } = "NEW";  // NEW, CONTACTED, COMPLETED

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    //CONTACT TABLE
    public class ContactMessage
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Contact { get; set; } = null!; // email or phone

        public string SubjectType { get; set; } = "General Enquiry";

        public string Message { get; set; } = null!;

        public string Status { get; set; } = "NEW"; // NEW, RESPONDED

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Announcement
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;      // e.g. "Easter Service"

        public string Message { get; set; } = null!;    // short banner text

        public string? LinkUrl { get; set; }            // optional "Learn more" link

        public DateTime? StartAt { get; set; }          // when to start showing

        public DateTime? EndAt { get; set; }            // when to stop showing

        public bool IsActive { get; set; } = true;      // manual on/off

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
