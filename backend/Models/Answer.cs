using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace prid_2425_f06.Models;

public class Answer {
    private readonly FormContext? _formContext;
    public Answer() {}
    public Answer(FormContext formContext) {
        this._formContext = formContext;
    }
    [ForeignKey(nameof(Instance))]
    public int InstanceId { get; set; } = 0;
    public Instance instance { get; set; }
    [ForeignKey(nameof(Question))]
    public int QuestionId { get; set; } = 0;
    public Question Question { get; set; }
    public int Idx { get; set; } = 0;
    public string Value { get; set; } = "";
}