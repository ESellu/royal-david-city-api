using System.ComponentModel.DataAnnotations;

namespace RoyalDavidCity.Api.ModelsAuth
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;
    }

    public class ResetPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Token { get; set; } = null!;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = null!;

        [Required]
        [Compare(nameof(NewPassword))]
        public string ConfirmPassword { get; set; } = null!;
    }
}
