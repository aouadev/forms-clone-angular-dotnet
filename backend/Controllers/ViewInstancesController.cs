using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using prid_2425_f06.Models;

namespace prid_2425_f06.Controllers;
[Authorize]
[Route("api/[controller]")]
[ApiController]

    public class ViewInstancesController : ControllerBase
    {
        private readonly FormContext _context;
        private readonly IMapper _mapper;

        public ViewInstancesController(FormContext context, IMapper mapper) {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FormWithAllInstancesDTO>> GetInstancesDetails(int id) {
            var formWithAllInstance = await _context.Forms.Where(f => f.FormId == id)
                .Include(f => f.Instances.Where(i => i.FormId == id && i.Completed != null))
                
                .FirstOrDefaultAsync();
            if (formWithAllInstance == null) {
                return NotFound();
            }

            var formDto = _mapper.Map<FormWithAllInstancesDTO>(formWithAllInstance);
            if (formWithAllInstance.Instances.Count == 0) {
                return NotFound();
            }
            formDto.Instances = formDto.Instances
                .OrderByDescending(i => i.Completed).ToList();

            foreach (var instance in formDto.Instances) {
                instance.User = _mapper.Map<UserDTO>(_context.Users.Where(u => u.Id == instance.UserId).FirstOrDefault());
            }
            return formDto;
        }




    }
