using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;
using RoyalDavidCity.Api.Dtos;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactMessagesController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public ContactMessagesController(RdcdfDbContext db)
        {
            _db = db;
        }

        // POST: /api/ContactMessages
        [HttpPost]
        public async Task<ActionResult<ContactMessageResponseDto>> Create(
            [FromBody] ContactMessageCreateDto dto,
            CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Contact) ||
                string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest("Name, contact and message are required.");
            }

            var entity = new ContactMessage
            {
                Name = dto.Name.Trim(),
                Contact = dto.Contact.Trim(),
                SubjectType = dto.SubjectType,
                Message = dto.Message.Trim(),
                Status = "NEW",
                CreatedAt = DateTime.UtcNow
            };

            await _db.ContactMessages.AddAsync(entity, ct);
            await _db.SaveChangesAsync(ct);

            var response = new ContactMessageResponseDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                Status = entity.Status
            };

            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, response);
        }

        // GET: /api/ContactMessages/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ContactMessageResponseDto>> GetById(int id, CancellationToken ct)
        {
            var entity = await _db.ContactMessages
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id, ct);

            if (entity == null)
                return NotFound();

            var response = new ContactMessageResponseDto
            {
                Id = entity.Id,
                CreatedAt = entity.CreatedAt,
                Status = entity.Status
            };

            return Ok(response);
        }
    }
}
