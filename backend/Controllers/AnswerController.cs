using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f06.Models;
using prid_2425_f06.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;

using System.Security.Cryptography;

namespace prid_2425_f06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]

public class AnswerController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly FormContext _context;

    public AnswerController(FormContext context, IMapper mapper) {
        _mapper = mapper;
        _context = context;

    }

    [HttpPost]
    public async Task<ActionResult<bool>> PostQuestion(List<AnswerDTO> answerDtos) {
        var oldAnswers = await _context.Answers.Where((answer) => answer.QuestionId == answerDtos[0].QuestionId 
                                                                  && answer.InstanceId == answerDtos[0].InstanceId).ToListAsync();
        //pour supprimer les réponses de checklist qui ont été décheckés dans le frontend
        foreach (var answer in oldAnswers) { 
            if (!answerDtos.Any(answerDto =>
                    answerDto.QuestionId == answer.QuestionId 
                    && answerDto.InstanceId == answer.InstanceId
                    && answerDto.Idx == answer.Idx)){ 
                _context.Answers.Remove(answer);
            }
        }
        foreach (var answerDto in answerDtos) {
            var oldAnswer = oldAnswers.SingleOrDefault(answer => answer.Idx == answerDto.Idx);
            if (oldAnswer == null ) {
                var newAnswer = _mapper.Map<Answer>(answerDto);
                var res = await new AnswerValidator(_context, newAnswer.Question).ValidateAsync(newAnswer);
                if (!res.IsValid) {
                    return BadRequest(new
                    { Message = "answer is invalid."});
                }
                _context.Answers.Add(newAnswer);
            } else{
                oldAnswer.Value = answerDto.Value;
            }
        }
        
      
        await _context.SaveChangesAsync();
        return true;
        
    }
}