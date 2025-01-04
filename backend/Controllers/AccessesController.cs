using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;


namespace prid_2425_f06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class AccessesController : ControllerBase { 
    private readonly IMapper _mapper; 
    private readonly FormContext _context;
    public AccessesController(IMapper mapper, FormContext context) {
        _mapper = mapper;
        _context = context; 
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormWithUsersAccessesDTO>>GetAccesses(int id) {
        var from =  await _context.Forms.Where(f => f.FormId == id)
            .Include(f => f.Accesses)
            .ThenInclude(fa => fa.User)
            .FirstOrDefaultAsync();
        var owner = await _context.Forms
            .Where(f => f.FormId == id)
            .Select(f => f.Owner).FirstOrDefaultAsync();
        var usersWithAccesses = await _context.FormsAccess
            .Where(fa => fa.FormId == id)
            .Select(fa => fa.UserId)
            .ToListAsync();
        var allUsers = await _context.Users.Where(u => u.Id != owner.Id && u.Role != Role.Admin && !usersWithAccesses.Contains(u.Id)).ToListAsync();
      /*  var allUsers = await _context.Users
            .Where(u => u.Role != Role.Admin && u.Id !=
                            _context.Forms
                                .Where(f => f.FormId == id)
                                .Select(f => f.OwnerId)
                                .FirstOrDefault())
            .ToListAsync();*/
       // if (fromAccesses == null) return NotFound();
       var formDto = _mapper.Map<FormWithUsersAccessesDTO>(from);
       formDto.AllUsersWithoutAdmins = _mapper.Map<List<UserDTO>>(allUsers);
       return formDto;
    }

    [HttpDelete("{userId}/{formId}")]
    public async Task<ActionResult<bool>> DeleteAccesses(int userId, int formId) {
        var formAccess = await _context.FormsAccess
            .Where(fa => fa.FormId == formId && fa.UserId == userId).FirstOrDefaultAsync();
        if (formAccess == null) {
            BadRequest();

        }

        _context.FormsAccess.Remove(formAccess);
        await _context.SaveChangesAsync();

        return Ok(true);  //CreatedAtAction(nameof(GetAccesses), new { id = formId });
    }



}
