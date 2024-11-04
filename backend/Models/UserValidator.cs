using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;
using prid_2425_f06.Helpers;

namespace prid_2425_f06.Models;

public class UserValidator : AbstractValidator<User> 
{
    private readonly FormContext _context;

    public UserValidator(FormContext context) {
        _context = context;

        RuleFor(u => new {u.Id, u.Email})
            .MustAsync((u, token) => BeUniquEmail(u.Email, u.Id, token))
            .WithMessage("Email must be unique");
        
        RuleFor(u => u.Email)
            .Must((u, token) => IsValidEmail(u.Email))
            .WithMessage("Email must have a valid format");
        
        RuleFor(u => u.Password)
            .Must((u, token) => IsValidPassword(u.Password))
            .WithMessage("The Password must be between 3 and 10 car");
        
        _ = RuleFor(u => new { u.FirstName, u.LastName })
            .Must(u => IsValidName(u.FirstName, u.LastName))
            .WithMessage("Not valid name!!!")
            .DependentRules(() => {
                RuleFor(u => new { u.Id, u.FirstName, u.LastName })
                    .MustAsync((u, token) => ValidateName(u.Id, u.FirstName, u.LastName, token)).WithMessage("The name must be unique");
            });
        
        RuleFor(u => u.BirthDate)
            .LessThan(DateTime.Today)
            .DependentRules(() => {
                RuleFor(u => Age(u.BirthDate))
                .InclusiveBetween(18, 125)
                .WithMessage("The age must be between 18 and 125 years");
            });

        RuleFor(u => u.Role)
            .IsInEnum();
        
        RuleSet("authenticate", () => {
            RuleFor(u => u.Token)
                .NotNull().OverridePropertyName("Password").WithMessage("Incorrect password");
        });

    }

  

    private async Task<bool> BeUniquEmail(string email, int id, CancellationToken token) {
        return !await _context.Users.AnyAsync(u => u.Id != id && u.Email == email, token);
    }

    private async Task<bool> ValidateName(int id, string firstName, string lastName, CancellationToken token) {
        return //(string.IsNullOrEmpty(firstName) && string.IsNullOrEmpty(lastName)) || 
        //!string.IsNullOrEmpty(firstName) && !string.IsNullOrEmpty(lastName) &&
        !await _context.Users.AnyAsync(u => u.Id != id && u.FirstName == firstName && u.LastName == lastName, token);
    }

    private bool IsValidEmail(string email)
    {
    if (string.IsNullOrWhiteSpace(email))
        return false;

    string regex = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
    return Regex.IsMatch(email, regex, RegexOptions.IgnoreCase);
    }

    private bool IsValidPassword(string password) {
        string regex = @"^.{3,10}$";
        return Regex.IsMatch(password, regex, RegexOptions.IgnoreCase);
    }
    private bool IsValidName(string firstName, string lastName) {
       return string.IsNullOrEmpty(firstName) && string.IsNullOrWhiteSpace(lastName) ||
       ValidateName(firstName) && ValidateName(lastName);

    }
    private bool ValidateName(string name) {
         string regex = @"^(?!\s)(?!.*\s$).{3,50}$";
         return Regex.IsMatch(name, regex, RegexOptions.IgnoreCase);
    }

    private int? Age(DateTimeOffset? birthDay) {
        if (!birthDay.HasValue) 
            return null;
        var today = DateTime.Today;
        var age = today.Year - birthDay.Value.Year;
        if (birthDay.Value.Date > today.AddYears(-age))
            age--;
        return age;
    }
    
    public async Task<FluentValidation.Results.ValidationResult> ValidateForAuthenticate(User? user) {
        if (user == null)
            return ValidatorHelper.CustomError("User not found.", "Email");
        return await this.ValidateAsync(user, o => o.IncludeRuleSets("authenticate"));

    }
  
}