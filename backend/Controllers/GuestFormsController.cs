using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;

namespace prid_2425_f06.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GuestFormscontroller : ControllerBase {
    private readonly FormContext _context;
    private readonly IMapper _mapper;
    public GuestFormscontroller(FormContext context, IMapper mapper) {
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
        return guestForms.OrderBy(f => f.Title).ToList();

    }
    
    [HttpGet("{id}")]
    public async Task<ActionResult<InstanceWithFormDetailedDTO>> GetFormsQuestions(int id) {
        
        var form = await _context.Forms.Where(f => f.FormId == id)
            .Include(f => f.Questions)
            .ThenInclude(q => q.OptionList)
            .ThenInclude(o => o.OptionValues)
            .FirstOrDefaultAsync();
        if (form == null) {
            return NotFound("form not found");
        } 
            var user = await _context.Users.Where(u => u.Role == Role.Guest).FirstOrDefaultAsync();       
            var newInstance = new Instance {
                FormId = form.FormId,
                UserId = user.Id
            };
            _context.Instances.Add(newInstance);
            await _context.SaveChangesAsync();
            var instanceDTO = _mapper.Map<InstanceWithFormDetailedDTO>(newInstance);
            instanceDTO.Form = _mapper.Map<FormWithQuestionAndAnswersDTO>(form);

            return instanceDTO;  
                
    }

    [HttpPost]
    public async Task<ActionResult<bool>> PostGuestAnswer(List<AnswerDTO> answerDtos) {
        var answers = _mapper.Map<List<Answer>>(answerDtos);
        await _context.Answers.AddRangeAsync(answers);
        await _context.SaveChangesAsync();
        return true;
       
    
    }


}