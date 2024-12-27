using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;
using prid_2425_f06.Helpers;

namespace prid_2425_f06.Controllers;


[Route("api/[controller]")]
[ApiController]

public class OptionListController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly FormContext _context;

    public OptionListController(FormContext context, IMapper mapper) {
        _mapper = mapper;
        _context = context;

    }
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OptionListDTO>>> GetOptionLists() {
        var id = int.Parse(User?.Identity?.Name ?? "0");
        var optionLists = await _context.OptionLists.Where(o => o.OwnerId == id || o.OwnerId == null).ToListAsync();
        var optionListsDto = _mapper.Map<IEnumerable<OptionListDTO>>(optionLists);
        return Ok(optionListsDto);
        
    }

      [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<OptionListDTO>>> GetMyOptionLists(int id) {
        var optionLists = await _context.OptionLists.Where(o => o.OwnerId == id || o.OwnerId == null).ToListAsync();
        var optionListsDto = _mapper.Map<IEnumerable<OptionListDTO>>(optionLists);
        return Ok(optionListsDto);
        
    }
}