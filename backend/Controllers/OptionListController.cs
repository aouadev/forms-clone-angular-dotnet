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
    public async Task<ActionResult<IEnumerable<OptionListWithOptionValuesDto>>> GetOptionLists() {
        var id = int.Parse(User?.Identity?.Name ?? "0");
        var optionLists = await _context.OptionLists.Where(o => o.OwnerId == id || o.OwnerId == null)
                                                    .Include(o => o.OptionValues)
                                                    .OrderBy(o => o.Name)
                                                    .ToListAsync();
        var optionListsDto = _mapper.Map<IEnumerable<OptionListWithOptionValuesDto>>(optionLists);
        return Ok(optionListsDto);
        
    }

      [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<OptionListWithOptionValuesDto>>> GetMyOptionLists(int id) {
        var optionLists = await _context.OptionLists.Where(o => o.OwnerId == id || o.OwnerId == null).ToListAsync();
        var optionListsDto = _mapper.Map<IEnumerable<OptionListWithOptionValuesDto>>(optionLists);
        return Ok(optionListsDto);
        
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteOptionList(int id) {
        var option = await _context.OptionLists.Where(o => o.Id == id).FirstOrDefaultAsync();
        if (option == null) {
            return BadRequest("this Option does not exist");
        }
        _context.OptionLists.Remove(option);
        _context.SaveChanges();
        return Ok();

    }

    [HttpPost]
    public async Task<ActionResult<bool>> PostOptionList(OptionListWithOptionValuesDto optionListDTO) {
        var optionList = await _context.OptionLists
                        .Where(o => o.Id == optionListDTO.Id)
                        .Include(o => o.OptionValues)
                        .FirstOrDefaultAsync();
        if (optionList != null) {
            _context.OptionValues.RemoveRange(optionList.OptionValues);
            await _context.SaveChangesAsync();
            _mapper.Map(optionListDTO, optionList);
            await _context.SaveChangesAsync();
        }
        else { 
            optionList = _mapper.Map<OptionListWithOptionValuesDto, OptionList>(optionListDTO);
            await _context.OptionLists.AddAsync(optionList); 
            await _context.SaveChangesAsync();
        }
        return Ok();
    }

   
}