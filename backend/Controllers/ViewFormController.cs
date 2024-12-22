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
        var query = await _context.Instances.Where(i => i.FormId == id).ToListAsync();
        var form = await _context.Forms.Where(f => f.FormId == id)
                                        .Include(f => f.Questions)
                                        .ThenInclude(q => q.OptionList)
                                        .ThenInclude(o => o.OptionValues)
                                        .FirstOrDefaultAsync();

        var formDto = _mapper.Map<FormWithQuestionsDTO>(form);
        formDto.IsInstancied = query.Count() > 0;  
        return formDto;                             
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

    [HttpPut("{id}")]
    public async Task<ActionResult> PutForm(int id) {
        var form = await _context.Forms.FindAsync(id);
        if (form == null) {
            return BadRequest("Form Not found: " + id);
        }
        var isPublic = form.IsPublic;
        form.IsPublic = !isPublic;
        Console.WriteLine("is public :::::" + isPublic);
        if (!isPublic) {
            var userAccesses = _context.FormsAccess.Where(fa => fa.FormId == id && fa.AccessType == AccessType.User);
            _context.FormsAccess.RemoveRange(userAccesses);
        }
        await _context.SaveChangesAsync();
        return NoContent();



    }

}