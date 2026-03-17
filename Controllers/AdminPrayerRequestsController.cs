using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/admin/prayer-requests")]
    [Authorize]
    public class AdminPrayerRequestsController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public AdminPrayerRequestsController(RdcdfDbContext db)
        {
            _db = db;
        }

        // GET: api/admin/prayer-requests?status=New
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status)
        {
            var query = _db.PrayerRequests.AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(p => p.Status == status || p.Status == status.ToUpper());
            }


            var list = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(list);
        }

        [HttpPost("{id}/status")]
        public async Task<IActionResult> UpdatePrayerStatus(int id, [FromBody] string status)
        {
            var pr = await _db.PrayerRequests.FindAsync(id);
            if (pr == null) return NotFound();

            pr.Status = status;
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }

}

