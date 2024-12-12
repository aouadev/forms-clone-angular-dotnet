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
      
       /*var myForms = await _context.Forms.Where(f => f.OwnerId == id || f.IsPublic == true).ToListAsync();
        var formsIds = await _context.FormsAccess.Where(f => f.UserId == id).Select(fa => fa.FormId).ToListAsync();
        var myformsAccess = await _context.Forms.Where(f => formsIds.Contains(f.FormId)).ToListAsync();
        var AllMyForms = myForms.Concat(myformsAccess);
        List<FormWithUserDetailsDTO> forms = new List<FormWithUserDetailsDTO>();
        foreach (var form in AllMyForms) {
            var owner = _mapper.Map<UserDTO>(await _context.Users.Where(u => u.Id == form.OwnerId).FirstOrDefaultAsync());
            var lastInstance = await _context.Instances.Where(i => i.FormId == form.FormId && i.UserId == id )
                                                        .OrderByDescending(i => i.InstanceId)
                                                        .FirstOrDefaultAsync();
            
                var f = _mapper.Map<FormWithUserDetailsDTO>(form);
                f.Owner = owner;
                f.LastInstance = _mapper.Map<InstanceDTO>(lastInstance);
                forms.Add(f);
        }
      
        return forms.OrderBy(f => f.Title).ToList();*/
    
   // Charger tous les formulaires accessibles
    var formsQuery = _context.Forms
        .Where(f => f.OwnerId == id || f.IsPublic == true || 
                    _context.FormsAccess.Any(fa => fa.UserId == id && fa.FormId == f.FormId))
        .Select(f => new {
            Form = f,
            Owner = _context.Users.Where(u => u.Id == f.OwnerId).FirstOrDefault(),
            LastInstance = _context.Instances
                                .Where(i => i.FormId == f.FormId && i.UserId == id)
                                .OrderByDescending(i => i.InstanceId)
                                .FirstOrDefault()
        });

    var formsData = await formsQuery.ToListAsync();

    // Mapper les données en DTO
    var forms = formsData.Select(data => {
        var formDTO = _mapper.Map<FormWithUserDetailsDTO>(data.Form);
        formDTO.Owner = _mapper.Map<UserDTO>(data.Owner);
        formDTO.LastInstance = _mapper.Map<InstanceDTO>(data.LastInstance);
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
        var newInstance = new Instance {
            FormId = form.FormId,
            UserId = int.Parse(User?.Identity.Name),
        };
        _context.Instances.Add(newInstance);
        await _context.SaveChangesAsync();
        var instanceDTO = _mapper.Map<InstanceWithFormDetailedDTO>(newInstance);
        instanceDTO.Form = _mapper.Map<FormWithQuestionAndAnswersDTO>(form);

        return instanceDTO;          
    }


}