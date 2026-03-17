using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RoyalDavidCity.Api.Data;

namespace RoyalDavidCity.Api.Controllers
{
    [ApiController]
    [Route("api/admin/donations")]
    [Authorize]
    public class AdminDonationsController : ControllerBase
    {
        private readonly RdcdfDbContext _db;

        public AdminDonationsController(RdcdfDbContext db)
        {
            _db = db;
        }

        // GET: api/admin/donations
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _db.DonationPledges
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return Ok(list);
        }
        [HttpPost("{id}/status")]
        public async Task<IActionResult> UpdateDonationStatus(int id, [FromBody] string status)
        {
            var d = await _db.DonationPledges.FindAsync(id);
            if (d == null) return NotFound();

            d.Status = status;
            await _db.SaveChangesAsync();
            return NoContent();
        }

    }

}
