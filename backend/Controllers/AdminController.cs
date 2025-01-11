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
public class AdminController : ControllerBase {
    private readonly FormContext _context;
    private readonly IMapper _mapper;
    
    public AdminController(FormContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    [Authorized(Role.Admin)]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormWithUserDetailsDTO>>> GetForms() {
        var id = int.Parse(User?.Identity?.Name ?? "0");
        var data = await _context.Forms
                .Include(f => f.Owner)
                .Select(f => new{
                Form = f,
                LastInstance = _context.Instances
                                .Where(i => i.FormId == f.FormId && i.UserId == id)
                                .OrderByDescending(i => i.InstanceId)
                                .FirstOrDefault()    
                    
            }).ToListAsync();
      /*  List<FormWithUserDetailsDTO> AllForms = new List<FormWithUserDetailsDTO>();
        foreach (var form in forms) {
            FormWithUserDetailsDTO f = _mapper.Map<FormWithUserDetailsDTO>(form);
            var owner = _mapper.Map<UserWithPasswordDTO>(await _context.Users.Where(u => u.Id == form.).FirstOrDefaultAsync());
            f.Owner = owner;
            AllForms.Add(f);
        }*/
      var formsDto = data.Select(d => {
         var formDto =  _mapper.Map<FormWithUserDetailsDTO>(d.Form);
         formDto.LastInstance = _mapper.Map<InstanceDTO>(d.LastInstance);
         return formDto;
          
      }).OrderBy(f => f.Title).ToList();
      return formsDto;
    }
    
  /*  public async Task<ActionResult<IEnumerable<FormWithUserDetailsDTO>>> GetMyForms() {
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
                    .FirstOrDefault()
            });

        var formsData = await formsQuery.ToListAsync();

        // Mapper les données en DTO
        var forms = formsData.Select(data => {
            var formDTO = _mapper.Map<FormWithUserDetailsDTO>(data.Form);
            formDTO.Owner = _mapper.Map<UserWithPasswordDTO>(data.Owner);
            formDTO.LastInstance = _mapper.Map<InstanceDTO>(data.LastInstance);
            return formDTO;
        }).OrderBy(f => f.Title).ToList();

        return forms;
    }*/
}