using FluentValidation;
using prid_2425_f06.Models;
using System.Text.RegularExpressions;

public class AnswerValidator : AbstractValidator<Answer>
{
    private readonly FormContext _context;
    private Question? _currentQuestion;

    public AnswerValidator(FormContext context, Question? currentQuestion)
    {
        _context = context;
        _currentQuestion = currentQuestion;

      /*  RuleFor(answer => answer)
            .Must(answer => LoadQuestion(answer.QuestionId))
            .WithMessage("The related question could not be found.");*/

        RuleFor(answer => answer.Value)
            .NotEmpty()
            .When(answer => _currentQuestion != null && _currentQuestion.Required)
            .WithMessage("Value cannot be empty for required questions.");

        
        RuleFor(answer => answer.Value)
            .Must(IsValidEmail)
            .When(answer => _currentQuestion is {Type: QuestionType.Email })
            .WithMessage("Value must be a valid email address.");

        
        RuleFor(answer => answer.Value)
            .Must(IsInteger)
            .When(answer => _currentQuestion is { Type: QuestionType.Integer })
            .WithMessage("Value must be a valid integer.");
        
        RuleFor(answer => answer.Value)
            .Must(IsValidDate)
            .When(answer => _currentQuestion is { Type: QuestionType.Date})
            .WithMessage("Value must be a valid date.");
    }

    private bool LoadQuestion(int questionId)
    {
        _currentQuestion = _context.Questions.Find(questionId);
        return _currentQuestion != null;
    }




    private bool IsValidEmail(string email)
    {
        var emailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, emailPattern);
    }

    private bool IsInteger(string value)
    {
        return int.TryParse(value, out _);
    }

    private bool IsValidDate(string value)
    {
        return DateTime.TryParse(value, out _);
    }
}



