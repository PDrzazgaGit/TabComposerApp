using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using TabComposerApp.Server.Data;
using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TabulatureController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TabComposerAppContext _context;

        public TabulatureController(UserManager<AppUser> userManager, TabComposerAppContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpPost("AddTabulature")]
        public async Task<IActionResult> AddTabulature(string data)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;
            var tabulature = new Tabulature
            {

                Data = data,
                UserId = userId
            };
            _context.Tabulatures.Add(tabulature);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Tabulature added successfully", Id = tabulature.Id });
        }

        [HttpPost("UpdateTabulature")]
        public async Task<IActionResult> UpdateTabulature(int id, string data)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;
            var tabulature = await _context.Tabulatures.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (tabulature == null)
            {
                return NotFound(new { Message = "Tabulature not found" });
            }

            tabulature.Data = data;
            _context.Tabulatures.Update(tabulature);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Tabulature updated successfully" });
        }

        [HttpGet("GetTabulature")]
        public async Task<IActionResult> GetTabulature(int id)
        {
            var tabulature = await _context.Tabulatures.FirstOrDefaultAsync(t => t.Id == id);
            if (tabulature == null)
            {
                return NotFound(new { Message = "Tabulature not found" });
            }

            return Ok(new { Data = tabulature.Data });
        }
    }
}
