using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;
using RoyalDavidCity.Api.Dtos;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnnouncementsController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public AnnouncementsController(RdcdfDbContext db)
        {
            _db = db;
        }

        // GET: /api/Announcements/active
        [HttpGet("active")]
        public async Task<ActionResult<AnnouncementResponseDto?>> GetActive(CancellationToken ct)
        {
            var now = DateTime.UtcNow;

            var entity = await _db.Announcements
                .AsNoTracking()
                .Where(a => a.IsActive &&
                            (a.StartAt == null || a.StartAt <= now) &&
                            (a.EndAt == null || a.EndAt >= now))
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefaultAsync(ct);

            if (entity == null)
                return Ok(null); // no announcement

            return Ok(new AnnouncementResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Message = entity.Message,
                LinkUrl = entity.LinkUrl
            });
        }

        // POST: /api/Announcements  (admin use)
        [HttpPost]
        public async Task<ActionResult<AnnouncementResponseDto>> Create(
            [FromBody] AnnouncementCreateDto dto,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Title and message are required.");

            var entity = new Announcement
            {
                Title = dto.Title.Trim(),
                Message = dto.Message.Trim(),
                LinkUrl = string.IsNullOrWhiteSpace(dto.LinkUrl) ? null : dto.LinkUrl.Trim(),
                StartAt = dto.StartAt,
                EndAt = dto.EndAt,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            await _db.Announcements.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);

            var response = new AnnouncementResponseDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Message = entity.Message,
                LinkUrl = entity.LinkUrl
            };

            return CreatedAtAction(nameof(GetActive), new { }, response);
        }
    }
}
