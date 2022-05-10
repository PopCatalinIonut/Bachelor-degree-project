using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace licenta.BLL.Models
{
    public enum Condition
    {
        [EnumMember(Value = "New with tags")]
        NewWithTags = 1,
        [EnumMember(Value = "New without tags")]
        NewWithoutTags = 2,
        [EnumMember(Value = "New with defects")]
        NewWithDefects = 3,
        [EnumMember(Value = "Good")]
        Good = 4,
        [EnumMember(Value = "Used")]
        Used = 5
    }
}