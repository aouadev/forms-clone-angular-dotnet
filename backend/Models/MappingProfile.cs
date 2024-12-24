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
        CreateMap<FormDTO, Form>();

        CreateMap<Instance, InstanceDTO>();
        CreateMap<InstanceDTO, Instance>();

        CreateMap<Instance, InstanceWithFormDetailedDTO>();
        CreateMap<InstanceWithFormDetailedDTO, Instance>();

        CreateMap<Form, FormWithLastInstanceDTO>();
        CreateMap<FormWithLastInstanceDTO, Form>();
        CreateMap<Form, FormWithUserDetailsDTO>();
        CreateMap<FormWithUserDetailsDTO, Form>();

        CreateMap<OptionValue, OptionValueDTO>();
        CreateMap<OptionValueDTO, OptionValueDTO>();

       /* CreateMap<OptionList, OptionListWithValuesDTO>();
        CreateMap<OptionListWithValuesDTO, OptionList>();*/

        CreateMap<OptionList, OptionListDTO>();
        CreateMap<OptionListDTO, OptionList>();

       /* CreateMap<QuestionWithOLDetailsDTO, Question>();
        CreateMap<Question, QuestionWithOLDetailsDTO>();*/

        CreateMap<Form, FormWithQuestionAndAnswersDTO>();
        CreateMap<FormWithQuestionAndAnswersDTO, Form>();

        CreateMap<Question, QuestionDTO>();
        CreateMap<QuestionDTO, Question>();

        CreateMap<Answer, AnswerDTO>();
        CreateMap<AnswerDTO, Answer>();

        CreateMap<Question, QuestionWithAnswersDTO>();
        CreateMap<QuestionWithAnswersDTO, Question>();

        CreateMap<Form, FormWithQuestionsDTO>();
        CreateMap<FormWithQuestionsDTO, Form>();

    }
    
    
}
