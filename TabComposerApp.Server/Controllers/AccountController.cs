
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TabComposerApp.Server.Models;

namespace TabComposerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        UserManager<AppUser> _userManager;

        public AccountController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet(Name="GetUserProfile")]
        public async Task<IResult> GetUserProfile()
        {
            string userId = User.Claims.First(x => x.Type == "UserID").Value;
            var userDetails = await _userManager.FindByIdAsync(userId);
            return Results.Ok(
                new { 
                    Email = userDetails?.Email,
                    UserName = userDetails?.UserName
                }
            );
        }
    }
}
