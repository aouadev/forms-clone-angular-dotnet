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
        var id =  int.Parse(User?.Identity.Name);
        Console.WriteLine("id :::", id);
        var myForms = await _context.Forms.Where(f => f.OwnerId == id || f.IsPublic == true).ToListAsync();
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
      
        return forms.OrderBy(f => f.Title).ToList();
    }


}