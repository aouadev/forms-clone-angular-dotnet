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
        var forms = await _context.Forms.ToListAsync();
        List<FormWithUserDetailsDTO> AllForms = new List<FormWithUserDetailsDTO>();
        foreach (var form in forms) {
            FormWithUserDetailsDTO f = _mapper.Map<FormWithUserDetailsDTO>(form);
            var owner = _mapper.Map<UserDTO>(await _context.Users.Where(u => u.Id == form.OwnerId).FirstOrDefaultAsync());
            f.Owner = owner;
            AllForms.Add(f);
        }
        return AllForms;
    }
}