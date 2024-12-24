using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;

namespace prid_2425_f06.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GuestFormcontroller : ControllerBase {
    private readonly FormContext _context;
    private readonly IMapper _mapper;
    public GuestFormcontroller(FormContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FormWithUserDetailsDTO>>> GetPublicForms() {
        var forms = await _context.Forms.Where(f => f.IsPublic == true).ToListAsync();
        List<FormWithUserDetailsDTO> guestForms = new List<FormWithUserDetailsDTO>();
        foreach (var form in forms) {
            FormWithUserDetailsDTO f = _mapper.Map<FormWithUserDetailsDTO>(form);
            var owner = _mapper.Map<UserWithPasswordDTO>(await _context.Users.Where(u => u.Id == form.OwnerId).FirstOrDefaultAsync());
            f.Owner = owner;
            guestForms.Add(f);
        }
        return guestForms;

    }
        

}