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
    public async Task<ActionResult<IEnumerable<FormDTO>>> GetPublicForms() {
        return _mapper.Map<List<FormDTO>>(await _context.Forms.Where(f => f.IsPublic == true).ToListAsync());

    }
        

}