using FluentValidation;

namespace prid_2425_f06.Models
{
    public class FormValidator : AbstractValidator<Form>
    {
        public FormValidator()
        {
            RuleFor(form => form.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MinimumLength(3).WithMessage("Title must be at least 3 characters long.");

            RuleFor(form => form.Description)
                .MinimumLength(3).When(form => !string.IsNullOrEmpty(form.Description))
                .WithMessage("Description must be at least 3 characters long if provided.");
        }
    }
}