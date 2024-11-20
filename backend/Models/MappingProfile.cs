using AutoMapper;

namespace prid_2425_f06.Models;

public class MappingProfile : Profile
{
    private FormContext _context;

    public MappingProfile(FormContext context) {
        _context = context;
        
        CreateMap<User, UserDTO>();
        CreateMap<UserDTO, User>();

        CreateMap<User, UserWithPasswordDTO>();
        CreateMap<UserWithPasswordDTO, User>();

        CreateMap<Form, FormDTO>();
        CreateMap<FormDTO, FormDTO>();

        CreateMap<Instance, InstanceDTO>();
        CreateMap<InstanceDTO, Instance>();

        CreateMap<Form, FormWithLastInstanceDTO>();
        CreateMap<FormWithLastInstanceDTO, Form>();
        CreateMap<Form, FormWithUserDetailsDTO>();
        CreateMap<FormWithUserDetailsDTO, Form>();
    }
    
    
}
