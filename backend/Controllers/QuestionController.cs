using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;
using prid_2425_f06.Helpers;

namespace prid_2425_f06.Controllers;


[Route("api/[controller]")]
[ApiController]

public class QuestionController : ControllerBase {
    private readonly IMapper _mapper;
    private readonly FormContext _context;

    public QuestionController(FormContext context, IMapper mapper) {
        _mapper = mapper;
        _context = context;

    }

   
}