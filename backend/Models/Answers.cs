using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace prid_2425_f06.Models;

public class Answer {
    public int InstanceId { get; set; } = 0;
    public int QuestionId { get; set; } = 0;
    public int Idx { get; set; } = 0;
    public string Value { get; set; } = "";
}