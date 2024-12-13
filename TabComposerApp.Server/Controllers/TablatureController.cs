using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using TabComposerApp.Server.Data;
using TabComposerApp.Server.Models;
using TabComposerApp.Server.Repositories;
using TabComposerApp.Server.Services;

namespace TabComposerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TablatureController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TabComposerAppContext _context;
        private readonly ITablatureRepository _tablatureRepository;
        private readonly ITablatureService _tablatureService;

        public TablatureController(UserManager<AppUser> userManager, TabComposerAppContext context, ITablatureRepository tablatureRepository, ITablatureService tablatureService)
        {
            _userManager = userManager;
            _context = context;
            _tablatureRepository = tablatureRepository;
            _tablatureService = tablatureService;
        }

        [HttpPost("AddTablature")]
        public async Task<IActionResult> AddTablature(string data)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;

            var tabulature = new Tablature
            {
                Data = data,
                UserId = userId
            };

            try
            {
                if (!_tablatureService.ValidateTablatureData(tabulature.Data))
                {
                    return BadRequest(new { Meassage = "Invalid tablature data." });
                }
                await _tablatureRepository.AddAsync(tabulature);
                return Ok(new { Message = "Tablature added successfully", Id = tabulature.Id });
            }
            catch (DbUpdateException)
            {
                return StatusCode(500, new { Message = "Cannot add tablature due to a database error." });
            }
            catch (Exception)
            {
                return StatusCode(500, new { Message = "An error occurred while adding the tablature." });
            }
        }

        [HttpPost("UpdateTablature")]
        public async Task<IActionResult> UpdateTablature(int id, string data)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;

            try
            {
                var tabulature = await _tablatureRepository.GetByIdAsync(id);

                tabulature.Data = data;

                if (!_tablatureService.ValidateTablatureData(tabulature.Data))
                {
                    return BadRequest(new { Meassage = "Invalid tablature data." });
                }

                await _tablatureRepository.UpdateAsync(tabulature);

                return Ok(new { Message = "Tablature updated successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Tablature not found" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the tablature." });
            }
        }


        [HttpGet("GetTablature")]
        public async Task<IActionResult> GetTabulture(int id)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;

            try
            {
                var tabulature = await _tablatureRepository.GetByIdAsync(id);

                return Ok(new { Tabulature = tabulature.Data });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Tablature not found" });
            }
            
            catch (Exception)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving the tablature" });
            }
        }

        [HttpGet("GetUserTablaturesInfo")]
        public async Task<IActionResult> GetUserTablaturesInfo()
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;

            try
            {
                var tabulatures = await _tablatureRepository.GetUserTablaturesAsync(userId);
                var response = new Dictionary<int, object>();

                foreach (var tab in tabulatures)
                {
                    var data = _tablatureService.DeserializeTabulature(tab.Data);

                    if (data == null)
                    {
                        return StatusCode(500, new { Message = "An error occurred while retrieving the tablature" });
                    }

                    var title = data.Title;
                    var length = data.Measures?.Count ?? 0;
                    var created = tab.CreatedAt.ToString();
                    var tuning = data.Tuning?.Tuning?.Values
                        .Select(x => new { Notation = x.Notation })
                        .ToList();
                    var id = tab.Id;

                    // Dodaj dane do słownika
                    response[id] = new
                    {
                        Title = title,
                        Length = length,
                        Created = created,
                        Tuning = tuning
                    };
                }
                return Ok(response);
            }
            catch (Exception x)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving the tablature", Error = x});
            }
        }
    }
}
