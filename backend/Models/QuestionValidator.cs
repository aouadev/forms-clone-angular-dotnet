using FluentValidation;

namespace prid_2425_f06.Models
{
    public class QuestionValidator : AbstractValidator<Question>
    {
        public QuestionValidator() {
            RuleFor(question => question.Idx)
                .GreaterThan(0).WithMessage("Index must be greater than 0.");

            RuleFor(question => question.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MinimumLength(3).WithMessage("Title must be at least 3 characters long.");

            RuleFor(question => question.Description)
                .MinimumLength(3).When(question => !string.IsNullOrEmpty(question.Description))
                .WithMessage("Description must be at least 3 characters long if provided.");

            RuleFor(question => question.OptionList)
                .NotNull().When(question =>
                    question.Type == QuestionType.Check || question.Type == QuestionType.Combo ||
                    question.Type == QuestionType.Radio)
                .WithMessage("Option list must be provided for 'check', 'combo', or 'radio' question types.")
                .Null().When(question => question.Type != QuestionType.Check && question.Type != QuestionType.Combo &&
                                         question.Type != QuestionType.Radio)
                .WithMessage("Option list must be null for question types other than 'check', 'combo', or 'radio'.");
        }
    }
}