using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RoyalDavidCity.Api.Identity;
using RoyalDavidCity.Api.ModelsAuth;
using RoyalDavidCity.Api.ModelsAuth;
using RoyalDavidCity.Api.Services;

namespace RoyalDavidCity.Api.AuthController
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existing = await _userManager.FindByEmailAsync(model.Email);
            if (existing != null)
                return BadRequest(new { message = "Email is already registered." });

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FullName = model.FullName
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new { message = "Admin account created and logged in." });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid credentials." });

            var result = await _signInManager.PasswordSignInAsync(
                user,
                model.Password,
                model.RememberMe,
                lockoutOnFailure: true
            );

            if (result.Succeeded)
            {
                return Ok(new { message = "Login successful." });
            }

            if (result.IsLockedOut)
            {
                return Unauthorized(new { message = "Account locked due to multiple failed attempts." });
            }

            return Unauthorized(new { message = "Invalid credentials." });
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out." });
        }

        // GET: api/auth/me
        [HttpGet("me")]
        public async Task<IActionResult> Me(
            [FromServices] UserManager<ApplicationUser> userManager)
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Ok(new { isAuthenticated = false });

            var user = await userManager.GetUserAsync(User);

            return Ok(new
            {
                isAuthenticated = true,
                email = user?.Email,
                fullName = user?.FullName
            });
        }
        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null /*|| !(await _userManager.IsEmailConfirmedAsync(user))*/)
            {
                // Do not reveal whether the email exists
                return Ok();
            }

            // Generate Identity reset token
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Encode token into URL-safe base64
            var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);
            var base64Token = System.Convert.ToBase64String(tokenBytes);
            var urlSafeToken = base64Token.Replace("+", "-").Replace("/", "_").TrimEnd('=');

            var frontendBaseUrl = $"{Request.Scheme}://{Request.Host}";
            var resetUrl =
                $"{frontendBaseUrl}/reset-password.html?email={Uri.EscapeDataString(model.Email)}&token={urlSafeToken}";

            var subject = "Reset your Royal David City admin password";
            var body = $@"
<p>Hello {System.Net.WebUtility.HtmlEncode(user.FullName ?? user.Email)},</p>
<p>You requested a password reset. Click the link below to reset your password:</p>
<p><a href=""{resetUrl}"">Reset Password</a></p>
<p>If you did not request this, you can ignore this email.</p>
";

            await _emailSender.SendAsync(model.Email, subject, body);

            return Ok();
        }


        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest model)
        {
            Console.WriteLine($"[ResetPassword] Email: {model.Email}");
            Console.WriteLine($"[ResetPassword] RAW token from client: {model.Token}");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                Console.WriteLine("[ResetPassword] User not found for email.");
                return BadRequest("Invalid reset request.");
            }

            // Convert URL-safe base64 back to regular base64
            var incoming = model.Token.Replace("-", "+").Replace("_", "/");
            switch (incoming.Length % 4)
            {
                case 2: incoming += "=="; break;
                case 3: incoming += "="; break;
            }

            string decodedToken;
            try
            {
                var tokenBytes = System.Convert.FromBase64String(incoming);
                decodedToken = System.Text.Encoding.UTF8.GetString(tokenBytes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ResetPassword] Token base64 decode failed: {ex.Message}");
                return BadRequest("Invalid token.");
            }

            Console.WriteLine($"[ResetPassword] DECODED token: {decodedToken}");

            var result = await _userManager.ResetPasswordAsync(user, decodedToken, model.NewPassword);
            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                Console.WriteLine($"[ResetPassword] Reset errors: {errors}");
                return BadRequest(errors);
            }

            Console.WriteLine("[ResetPassword] Password reset succeeded.");
            return NoContent();
        }


    }
}
