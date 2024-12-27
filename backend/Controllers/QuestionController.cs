using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;
using prid_2425_f06.Helpers;

namespace prid_2425_f06.Controllers;


[Route("api/[controller]")]
[ApiController]

public class QuestionController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly FormContext _context;

    public QuestionController(FormContext context, IMapper mapper) {
        _mapper = mapper;
        _context = context;

    }

    [HttpPut]
    public async Task<IActionResult> UpdateQuestion(QuestionDTO questionDto) { // pour échanger l'ordre d'affichage entre deux questions
        //chercher la question concerné dans la base de donnée
        var question = await _context.Questions.SingleOrDefaultAsync(q => q.Id == questionDto.Id);
         if (question == null) {
            return NotFound();
        }
        //chercher la question qui contient le idx stocké dans le dto venant du frontend
        var otherQuestion = await _context.Questions.Where(q => q.FormId == question.FormId && q.Idx == questionDto.Idx).SingleOrDefaultAsync();
        if (otherQuestion == null) {
            return NotFound();
        }
        //échanger les idx entre les deux questions
        var tmpIdx = question.Idx;
        question.Idx = 0;
        await _context.SaveChangesAsync();
        otherQuestion.Idx = tmpIdx;
        question.Idx = questionDto.Idx;
    


        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost]
    public async Task<ActionResult<bool>> PostQuestion(QuestionDTO questionDto) {
       
        var question = await _context.Questions.FindAsync(questionDto.Id);
        if (question == null) {
             question = _mapper.Map<QuestionDTO, Question>(questionDto);
           await _context.Questions.AddAsync(question);
            await _context.SaveChangesAsync();
            return Ok(true);
        }
        else {
            _mapper.Map(questionDto, question);
            await _context.SaveChangesAsync();
        }
        return NoContent();
    }


   
}