using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;
using prid_2425_f06.Helpers;

namespace prid_2425_f06.Controllers;

[Route("api/[controller]")]
[ApiController]

public class InstanceController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly FormContext _context;

    public InstanceController(FormContext context, IMapper mapper) {
        _mapper = mapper;
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<InstanceDTO>>> GetInstance() {
        return _mapper.Map<List<InstanceDTO>>(await _context.Instances.ToListAsync());
    }

    
[HttpGet("{id}")]
public async Task<ActionResult<InstanceWithFormDetailedDTO>> GetInstance(int id, bool readOnly) {
    // Charger l'ancienne instance avec toutes les réponses
    var instance = await _context.Instances
        .Where(i => i.InstanceId == id)
        .Include(i => i.Form)
        .ThenInclude(f =>  f.Questions)
        .ThenInclude(q => q.Answers) // Charger toutes les réponses
        .Include(i => i.Form)
        .ThenInclude(f => f.Questions)
        .ThenInclude(q => q.OptionList)
        .ThenInclude(o => o.OptionValues)
        .FirstOrDefaultAsync();
    if (instance == null)
        return NotFound();

    // Filtrer les réponses de l'ancienne instance
    var filtredAnswers = instance.Form.Questions.ToList(); //une copie
    foreach (var question in filtredAnswers) {
        question.Answers = question.Answers.Where(a => a.InstanceId == id).ToList();
    }

    // Retourner l'instance filtrée (ancienne ou nouvelle)
    return _mapper.Map<InstanceWithFormDetailedDTO>(instance);
}


[HttpPost]
public async Task<ActionResult<bool>> PutInstance(InstanceWithFormDetailedDTO instanceDTO)
{ var instance = await _context.Instances
        .Where(i => i.InstanceId == instanceDTO.InstanceId)
        .FirstOrDefaultAsync();

    if (instance == null)
    {
        return NotFound();
    }
    var answers = await _context.Answers
        .Where(a => a.InstanceId == instanceDTO.InstanceId)
        .Include(a => a.Question)
        .ToListAsync();
    var invalidAnswers = new List<Answer>();

    foreach (var answer in answers)
    {
        var res = await new AnswerValidator(_context, answer.Question).ValidateAsync(answer);
        if (!res.IsValid)
        {
            invalidAnswers.Add(answer);
        }
    }
    if (invalidAnswers.Any())
    {
        _context.Answers.RemoveRange(invalidAnswers);
        await _context.SaveChangesAsync(); 
        return BadRequest(new
        {
            Message = "some answers are invalid.",
            InvalidAnswers = invalidAnswers.Select(a => a.Value).ToList()
        });
    }
    instance.Completed = DateTimeOffset.UtcNow;
    await _context.SaveChangesAsync();

    return Ok(true);
}

    
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteInstance(int id) {
        var instance = await _context.Instances.FindAsync(id);
        if (instance == null) {
            return BadRequest(); 
        } 
        _context.Remove(instance);
        await _context.SaveChangesAsync();
        return NoContent(); 
    }
        



}