using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;
using RoyalDavidCity.Api.Dtos;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DonationsController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public DonationsController(RdcdfDbContext db)
        {
            _db = db;
        }

        // POST: /api/Donations
        [HttpPost]
        public async Task<ActionResult<DonationResponseDto>> Create(
            [FromBody] DonationCreateDto dto,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName) || string.IsNullOrWhiteSpace(dto.Contact))
                return BadRequest("Full name and contact are required.");

            if (dto.AmountNle <= 0)
                return BadRequest("Amount must be greater than zero.");

            var entity = new DonationPledge
            {
                FullName = dto.FullName.Trim(),
                Contact = dto.Contact.Trim(),
                AmountNle = dto.AmountNle,
                Purpose = dto.Purpose,
                Message = string.IsNullOrWhiteSpace(dto.Message) ? null : dto.Message.Trim(),
                Status = "NEW",
                CreatedAt = DateTime.UtcNow
            };

            await _db.DonationPledges.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);

            var response = new DonationResponseDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                Status = entity.Status
            };

            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, response);
        }

        // GET: /api/Donations/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<DonationResponseDto>> GetById(int id, CancellationToken ct)
        {
            var entity = await _db.DonationPledges
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, ct);

            if (entity == null)
                return NotFound();

            var response = new DonationResponseDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                Status = entity.Status
            };

            return Ok(response);
        }
    }
}
