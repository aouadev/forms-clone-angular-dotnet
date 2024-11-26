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
public async Task<ActionResult<InstanceWithFormDetailedDTO>> GetInstance(int id) {                 
    var instance = await _context.Instances
        .Where(i => i.InstanceId == id)
        .Include(i => i.Form)
        .ThenInclude(f => f.Questions)
        .ThenInclude(q => q.Answers.Where(a => a.InstanceId == id))
        .Include(i => i.Form)
        .ThenInclude(f => f.Questions)
        .ThenInclude(q => q.OptionList)
        .ThenInclude(o => o.OptionValues)
        .FirstOrDefaultAsync();

    if (instance == null)
        return NotFound(); // Gère le cas où l'instance n'existe pas.

  
    return _mapper.Map<InstanceWithFormDetailedDTO>(instance); 
}


}