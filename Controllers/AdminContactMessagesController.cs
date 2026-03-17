using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/admin/contact-messages")]
    [Authorize]
    public class AdminContactMessagesController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public AdminContactMessagesController(RdcdfDbContext db)
        {
            _db = db;
        }

        // GET: api/admin/contact-messages
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.ContactMessages
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(list);
        }
        [HttpPost("{id}/status")]
        public async Task<IActionResult> UpdateContactStatus(int id, [FromBody] string status)
        {
            var cm = await _db.ContactMessages.FindAsync(id);
            if (cm == null) return NotFound();

            cm.Status = status;
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }
}
