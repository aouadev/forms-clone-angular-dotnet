using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using prid_2425_f06.Models;
using prid_2425_f06.Helpers;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;

using System.Security.Cryptography;

namespace prid_2425_f06.Controllers;


[Route("api/[controller]")]
[ApiController]

public class AnswerController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly FormContext _context;

    public AnswerController(FormContext context, IMapper mapper) {
        _mapper = mapper;
        _context = context;

    }

    [HttpPost]
    public async Task<ActionResult<bool>> PostQuestion(AnswerDTO AnswerDTO) {
        var answer = _mapper.Map<Answer>(AnswerDTO);
        _context.Answers.Add(answer);
        await _context.SaveChangesAsync();
        return true;
        
    }
}