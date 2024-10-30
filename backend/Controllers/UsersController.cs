using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f06.Models;

namespace prid_2425_f06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly FormContext _context;
    private readonly IMapper _mapper;

    public UsersController(FormContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }
    
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll() {
        // Récupère une liste de tous les users et utilise le mapper pour les transformer en leur DTO
        return _mapper.Map<List<UserDTO>>(await _context.Users.ToListAsync());
    }

    
   [HttpPost]
    public async Task<ActionResult<UserDTO>> PostUser(UserWithPasswordDTO userWithPasswordDTO) {
        var newUser = _mapper.Map<User>(userWithPasswordDTO);
        var result = await new UserValidator(_context).ValidateAsync(newUser);
        if (!result.IsValid)
            return BadRequest(result);
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new {id = userWithPasswordDTO.Id}, _mapper.Map<UserDTO>(newUser));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDTO>> GetUser(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null) {
            return NotFound();
        }
        return _mapper.Map<UserDTO>(user);
        
    }

    [HttpGet("byEmail/{email}")]
    public ActionResult<UserDTO> GetByEmail(string email) {
        var user =  _context.Users.Where(u => u.Email == email).FirstOrDefault();
        if (user == null) {
            return NotFound();
        }
        return _mapper.Map<UserDTO>(user);
    }

    [HttpPut] 
    public async Task<ActionResult> PutUser(UserDTO userDto) {
        var user = await _context.Users.FindAsync(userDto.Id);
        if (user == null) {
            return NotFound();
        }
        _mapper.Map<UserDTO, User>(userDto, user);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id) {
        var user = await _context.Users.FindAsync(id);
        if (user == null) {
            return NotFound();
        }
        _context.Remove(user);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
}
