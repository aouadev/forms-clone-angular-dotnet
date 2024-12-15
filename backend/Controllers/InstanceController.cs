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
        .ThenInclude(f => f.Questions)
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

   /* if (!readOnly) {
        // Créer une nouvelle instance
        var newInstance = new Instance {
            FormId = instance.FormId,
            UserId = instance.UserId
        };
        _context.Instances.Add(newInstance);
        await _context.SaveChangesAsync();

        // Copier les réponses filtrées vers la nouvelle instance
        foreach (var question in filtredAnswers) {
            var answersCopy = question.Answers.ToList();
            foreach (var answer in answersCopy) {
                var newAnswer = new Answer {
                    InstanceId = newInstance.InstanceId,
                    QuestionId = answer.QuestionId,
                    Idx = answer.Idx,
                    Value = answer.Value
                };
                _context.Answers.Add(newAnswer);
            }
        }
        await _context.SaveChangesAsync();

        // Charger la nouvelle instance
        instance = await _context.Instances
            .Where(i => i.InstanceId == newInstance.InstanceId)
            .Include(i => i.Form)
            .ThenInclude(f => f.Questions)
            .ThenInclude(q => q.Answers) // Charger toutes les réponses
            .Include(i => i.Form)
            .ThenInclude(f => f.Questions)
            .ThenInclude(q => q.OptionList)
            .ThenInclude(o => o.OptionValues)
            .FirstOrDefaultAsync();

        // Filtrer les réponses liées à la nouvelle instance
        var newFiltredAnswers = instance.Form.Questions.ToList(); //une copie pour éviter les erreurs inattendu
        foreach (var question in newFiltredAnswers) {
            question.Answers = question.Answers.Where(a => a.InstanceId == newInstance.InstanceId).ToList();
        }
    }*/

    // Retourner l'instance filtrée (ancienne ou nouvelle)
    return _mapper.Map<InstanceWithFormDetailedDTO>(instance);
}


    [HttpPost]
    public async Task<ActionResult<InstanceWithFormDetailedDTO>> PostQuestion(InstanceWithFormDetailedDTO instanceDTO) {
        var instance = _mapper.Map<Instance>(instanceDTO);
        _context.Instances.Add(instance);
        foreach(var question in instanceDTO.Form.Questions) {
            //var answer[] = _mapper.Map<Answer[]>(question.Answers);
             
        }
       
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInstance), new { id = instance.InstanceId}, _mapper.Map<InstanceDTO>(instance));
        
    }

    /* [HttpGet("{id}")]
    public async Task<ActionResult<InstanceDTO>> GetSimpleInstance(int id) {
        var instance = await _context.Instances.FindAsync(id);
        if (instance == null) {
            return NotFound();
        }
        return _mapper.Map<InstanceDTO>(instance);
        
    }*/


}