using CsvHelper;
using System.Globalization;
using prid_2425_f06.Helpers;
using CsvHelper.Configuration;

namespace prid_2425_f06.Models
{
    public class SeedData(FormContext context) 
    {
        public void Seed() {
            context.Users.AddRange(ImportCsvData<User, UserMap>(@"Models\Data\users.csv"));
            context.Forms.AddRange(ImportCsvData<Form, FormMap>(@"Models\Data\forms.csv"));
            context.FormsAccess.AddRange(ImportCsvData<FormAccess, FormAccessMap>(@"Models\Data\user_form_accesses.csv"));
            context.Instances.AddRange(ImportCsvData<Instance, InstanceMap>(@"Models\Data\instances.csv"));
            context.SaveChanges();
        }

          private static List<T> ImportCsvData<T, TM>(string filePath) where TM : ClassMap {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
                HasHeaderRecord = true,
                MissingFieldFound = null,
            };

            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);
            csv.Context.RegisterClassMap<TM>();

            return csv.GetRecords<T>().ToList();
        }
    
    }
    internal sealed class UserMap: ClassMap<User>
    {
        public UserMap() {
            Map(u => u.Id).Name("id");
            Map(u => u.Email).Name("email");
            Map(u => u.Password)
                .Convert(data => TokenHelper.GetPasswordHash(data.Row.GetField("password") ?? ""));
            Map(u => u.FirstName).Name("first_name");
            Map(u => u.LastName).Name("last_name");
            Map(u => u.Role)
                .Convert(data => Enum.Parse<Role>(data.Row.GetField("role") ?? "", true));
            Map(u => u.BirthDate).Name("birth_date");

        }
    }

    internal sealed class FormMap : ClassMap<Form>
    {
        public FormMap() {
            Map(f => f.FormId).Name("id");
            Map(f => f.Title).Name("title");
            Map(f => f.Description).Name("description");
            Map(f => f.OwnerId).Name("owner");
            Map(f => f.IsPublic).Name("is_public");
        }
    }
    internal sealed class FormAccessMap : ClassMap<FormAccess>
    {
        public FormAccessMap() {
            Map(fa => fa.FormId).Name("form");
            Map(fa => fa.UserId).Name("user");
            Map(fa => fa.AccessType)
                .Convert(data => Enum.Parse<AccessType>(data.Row.GetField("access_type") ?? "", true));
        }
    }
    
    internal sealed class InstanceMap : ClassMap<Instance> {
        public InstanceMap() {
            Map(i => i.InstanceId).Name("id");
            Map(i => i.FormId).Name("form");
            Map( i => i.UserId).Name("user");
            Map(i => i.Started).Name("started");
            Map(i => i.Completed).Name("completed");
        }
    }
}