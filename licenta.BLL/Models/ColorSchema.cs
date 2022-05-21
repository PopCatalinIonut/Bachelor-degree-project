using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace licenta.BLL.Models
{
    public class ColorSchema
    {
        public ColorSchema(List<string> colors, string predominantPalette, bool containsWarm, bool containsCool, bool containsNonColor)
        {
            Colors = colors;
            PredominantPalette = predominantPalette;
            ContainsWarm = containsWarm;
            ContainsCool = containsCool;
            ContainsNonColor = containsNonColor;
        }

        public ColorSchema(List<string> colors) { Colors = colors; }

        public ColorSchema(){}
        [Key]
        public int Id { get; set; }
        public List<string> Colors { get; set; }
        public string PredominantPalette { get; set; }
        public bool ContainsWarm { get; set; }
        public bool ContainsCool { get; set; }
        public bool ContainsNonColor { get; set; }

        [ForeignKey("Item")]
        public int ItemId { get; set; }
    }

}