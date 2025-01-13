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
public class FormsController : ControllerBase {
    private readonly FormContext _context;
    private readonly IMapper _mapper;
    
    public FormsController(FormContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    
    
    [HttpGet]
public async Task<ActionResult<IEnumerable<FormWithUserDetailsDTO>>> GetMyForms() {
    var id = int.Parse(User?.Identity?.Name ?? "0");
    
    var formsQuery = _context.Forms
        .Where(f => f.OwnerId == id || f.IsPublic == true || 
                    _context.FormsAccess.Any(fa => fa.UserId == id && fa.FormId == f.FormId))
        .Select(f => new {
            Form = f,
            Owner = _context.Users.Where(u => u.Id == f.OwnerId).FirstOrDefault(),
            LastInstance = _context.Instances
                                .Where(i => i.FormId == f.FormId && i.UserId == id)
                                .OrderByDescending(i => i.InstanceId)
                                .FirstOrDefault(),
            IsEditor = _context.FormsAccess.Any(fa => fa.UserId == id && fa.FormId == f.FormId && fa.AccessType == AccessType.Editor),
        });

    var formsData = await formsQuery.ToListAsync();

    // Mapper les données en DTO
    var forms = formsData.Select(data => {
        var formDTO = _mapper.Map<FormWithUserDetailsDTO>(data.Form);
        formDTO.Owner = _mapper.Map<UserWithPasswordDTO>(data.Owner);
        formDTO.LastInstance = _mapper.Map<InstanceDTO>(data.LastInstance);
        formDTO.IsEditor = data.IsEditor;
        return formDTO;
    }).OrderBy(f => f.Title).ToList();

    return forms;
}
 
     
    
    
    [HttpGet("{id}")]
    public async Task<ActionResult<InstanceWithFormDetailedDTO>> GetFormsQuestions(int id) {
        
        var form = await _context.Forms.Where(f => f.FormId == id)
                  .Include(f => f.Questions)
                  .ThenInclude(q => q.OptionList)
                  .ThenInclude(o => o.OptionValues)
                  .FirstOrDefaultAsync();
        if (form == null) {
            return NotFound();
        } else { 
        var userId = int.Parse(User?.Identity?.Name ?? "0");       
        var newInstance = new Instance {
            FormId = form.FormId,
            UserId = userId,
        };
        _context.Instances.Add(newInstance);
        await _context.SaveChangesAsync();
        var instanceDTO = _mapper.Map<InstanceWithFormDetailedDTO>(newInstance);
        instanceDTO.Form = _mapper.Map<FormWithQuestionAndAnswersDTO>(form);

        return instanceDTO;  
        }        
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteForm(int id) {
        var form = await _context.Forms.FindAsync(id);
        if (form == null) {
            return BadRequest();
        }
         _context.Remove(form);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    [HttpPost]
    public async Task<ActionResult<int>> PostForm(FormDTO formDto) {
        if (formDto == null) {
            return BadRequest("Form data is null");
        }
        var form = await _context.Forms.Where(f => f.FormId == formDto.FormId)
            .SingleOrDefaultAsync();
        if (form == null) {
            form = _mapper.Map<FormDTO, Form>(formDto);
            var res = await new FormValidator().ValidateAsync(form);
            if (!res.IsValid) {
                return BadRequest(new
                    { Message = "form is invalid."});
            }
            
            
            await _context.Forms.AddAsync(form);
            await _context.SaveChangesAsync();
            var id = form.FormId;
            return id ;
         
        } else {
            _mapper.Map(formDto, form);
             await _context.SaveChangesAsync();
             return Ok(true);
        }
        

    }


}