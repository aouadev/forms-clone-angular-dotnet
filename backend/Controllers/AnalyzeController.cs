using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;

namespace prid_2425_f06.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]

public class AnalyzeController : ControllerBase
{
    private readonly FormContext _context;
    private readonly IMapper _mapper;

    public AnalyzeController(FormContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("{formId}")]
    public async Task<ActionResult<FormWithQuestionAndAnswersAndInstanceDTO>> GetFormWithAllInstances(int formId) {
        var formWithAllInstance = await _context.Forms
            .Where(f => f.FormId == formId)
            .Include(f => f.Questions)
            .ThenInclude(q => q.OptionList)
            .ThenInclude(o => o.OptionValues)
            .Include(f => f.Questions)
            .ThenInclude(q => q.Answers.Where(a => a.Instance.Completed != null))
            .ThenInclude(a => a.Instance)
            .FirstOrDefaultAsync();
        var formDTO= _mapper.Map<FormWithQuestionAndAnswersAndInstanceDTO>(formWithAllInstance);
        return Ok(formDTO);


    }
}
