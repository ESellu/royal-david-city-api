using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;
using RoyalDavidCity.Api.Dtos;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrayerRequestsController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public PrayerRequestsController(RdcdfDbContext db)
        {
            _db = db;
        }

        // POST: /api/prayerrequests
        [HttpPost]
        public async Task<ActionResult<PrayerRequestResponseDto>> Create(
            [FromBody] PrayerRequestCreateDto dto,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Message is required.");

            var entity = new PrayerRequest
            {
                Name = string.IsNullOrWhiteSpace(dto.Name) ? "Anonymous" : dto.Name.Trim(),
                Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
                Category = dto.Category,
                Message = dto.Message.Trim(),
                Confidential = dto.Confidential,
                Status = "New",
                CreatedAt = DateTime.UtcNow
            };

            await _db.PrayerRequests.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);

            var response = new PrayerRequestResponseDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                Status = entity.Status
            };

            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, response);
        }

        // GET: /api/prayerrequests/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<PrayerRequestResponseDto>> GetById(int id, CancellationToken ct)
        {
            var entity = await _db.PrayerRequests
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, ct);

            if (entity == null)
                return NotFound();

            var response = new PrayerRequestResponseDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                Status = entity.Status
            };

            return Ok(response);
        }
    }
}
