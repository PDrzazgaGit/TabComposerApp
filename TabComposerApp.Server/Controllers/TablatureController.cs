using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using TabComposerApp.Server.Data;
using TabComposerApp.Server.Models;
using TabComposerApp.Server.Models.DataTransferObjects;
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
        public async Task<IActionResult> AddTablature([FromBody] SerializedTabulature request)
        {
            try
            {
                // Przetwarzanie dużego JSON-a
                if (request == null)
                {
                    return BadRequest(new { Message = "Invalid tablature data." });
                }

                var tabulature = new Tablature
                {
                    Data = _tablatureService.SerializeTablature(request),
                    UserId = User.Claims.First(x => x.Type == "UserID").Value,
                };

                if (!_tablatureService.ValidateTablatureData(tabulature.Data))
                {
                    return BadRequest(new { Message = "Invalid tablature data." });
                }

                await _tablatureRepository.AddAsync(tabulature);
                return Ok(new { Message = "Tablature added successfully", tabulature.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost("UpdateTablature/{id}")]
        public async Task<IActionResult> UpdateTablature(int id, [FromBody] SerializedTabulature request)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;

            try
            {
                var tabulature = await _tablatureRepository.GetByIdAsync(id);

                tabulature.Data = _tablatureService.SerializeTablature(request);

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

        [AllowAnonymous]
        [HttpGet("GetTablature/{id}")]
        public async Task<IActionResult> GetTabulture(int id)
        {
            try
            {
                var data = await _tablatureRepository.GetByIdAsync(id);
                return Ok(new { Tablature = data.Data });
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
        

        [AllowAnonymous]
        [HttpGet("GetTablaturesInfo")]
        public async Task<IActionResult> GetTablaturesInfo()
        {
            try
            {
                var tabulatures = await _tablatureRepository.GetAllAsync();
                var response = new Dictionary<int, object>();

                foreach (var tab in tabulatures)
                {
                    var data = _tablatureService.DeserializeTablature(tab.Data);

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
                    var description = data.Description;
                    var author = data.Author;

                    // Dodaj dane do słownika
                    response[id] = new
                    {
                        Author = author,
                        Title = title,
                        Length = length,
                        Created = created,
                        Tuning = tuning,
                        Description = description
                    };
                }
                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving the tablature"});
            }
        }

        [HttpPost("DeleteTablature/{id}")]
        public async Task<IActionResult> DeleteTablature(int id)
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;
            try
            {
                var tabulatures = await _tablatureRepository.GetUserTablaturesAsync(userId);

                bool exists = tabulatures.Any(t => t.Id == id);

                if (!exists) {
                    return StatusCode(500, new { Message = "Tablature does not belong to this user." });
                }

                await _tablatureRepository.DeleteAsync(id);
                return Ok(new { Message ="Tabulature deleted"});
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Tablature not found" });
            }
            catch (Exception)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving the tablature"});
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
                    var data = _tablatureService.DeserializeTablature(tab.Data);

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

                    var description = data.Description;
                    // Dodaj dane do słownika
                    response[id] = new
                    {
                        Title = title,
                        Length = length,
                        Created = created,
                        Tuning = tuning,
                        Description = description
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
