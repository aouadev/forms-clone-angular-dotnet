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
    public async Task<ActionResult<IEnumerable<InstanceDTO>>> GetInstance(int id) {                 
        var query = from instance in _context.Instances
                    where instance.UserId == id
                    group instance by instance.FormId into g
                    select g.OrderByDescending(i => i.InstanceId).FirstOrDefault();
                    return  _mapper.Map<List<InstanceDTO>>(await query.ToListAsync());
                    

                
        
                

    }

}