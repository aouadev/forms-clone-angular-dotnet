using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f06.Helpers;
using prid_2425_f06.Models;

namespace prid_2425_f06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class ViewFormController(FormContext context, IMapper mapper) : ControllerBase {
    
    private readonly FormContext _context = context;
    private readonly IMapper _mapper = mapper;

    [HttpGet("{id}")]
    public async Task<ActionResult<FormWithQuestionsDTO>> GetFormWithQuestions(int id) {
        var form = await _context.Forms.Where(f => f.FormId == id)
                                        .Include(f => f.Questions)
                                        .ThenInclude(q => q.OptionList)
                                        .ThenInclude(o => o.OptionValues)
                                        .FirstOrDefaultAsync();
        return _mapper.Map<FormWithQuestionsDTO>(form);                               
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteQuestion(int id) {
        var question = await _context.Questions.FindAsync(id);
        if (question == null) {
            return NotFound();
        }
        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();
        return NoContent();

    }


}