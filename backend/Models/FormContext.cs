using Microsoft.EntityFrameworkCore;

namespace prid_2425_f06.Models;
public class FormContext : DbContext
{
    public FormContext(DbContextOptions<FormContext> options)
        : base(options) {
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder
            .LogTo(Console.WriteLine, LogLevel.Information)
            .EnableSensitiveDataLogging();
          }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {

        base.OnModelCreating(modelBuilder);
    
        modelBuilder.Entity<User>().HasIndex(u => new{u.FirstName,u.LastName}).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<FormAccess>().HasKey(a => new{a.FormId, a.UserId});
        modelBuilder.Entity<OptionValue>().HasKey(o => new {o.OptionListId, o.Idx});
        modelBuilder.Entity<OptionList>().HasIndex(o => new{o.OwnerId, o.Name}).IsUnique();
        modelBuilder.Entity<OptionValue>().HasIndex(o => new{o.OptionListId, o.Label}).IsUnique();
        modelBuilder.Entity<Question>().HasIndex(q => new{q.FormId, q.Title}).IsUnique( );
        modelBuilder.Entity<Question>().HasIndex(q => new{q.FormId, q.Idx}).IsUnique( );
        modelBuilder.Entity<Answer>().HasKey(a => new{a.InstanceId, a.QuestionId, a.Idx});

        modelBuilder.Entity<Answer>()
            .HasOne(a => a.Question)
            .WithMany(q => q.Answers)
            .HasForeignKey(a => a.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<OptionValue>()
            .HasOne(o => o.OptionList)
            .WithMany(o => o.OptionValues)
            .HasForeignKey(o => o.OptionListId)
            .OnDelete(DeleteBehavior.Cascade); 
        modelBuilder.Entity<Form>()
            .HasMany(f => f.Questions)
            .WithOne(q => q.Form)
            .HasForeignKey(q => q.FormId)
            .OnDelete(DeleteBehavior.Cascade);
         modelBuilder.Entity<Form>()
            .HasMany(f => f.Instances)
            .WithOne(i => i.Form)
            .HasForeignKey(i => i.FormId)
            .OnDelete(DeleteBehavior.Cascade);
         modelBuilder.Entity<Form>()
            .HasMany(f => f.Accesses)
            .WithOne(a => a.Form)
            .HasForeignKey(a => a.FormId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Question>()
            .HasOne(q => q.OptionList)
            .WithMany(o => o.Questions)
            .HasForeignKey(q => q.OptionListId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Form>()
            .HasMany(f => f.Accesses)
            .WithOne(a => a.Form)
            .HasForeignKey(a => a.FormId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<User>()
            .HasMany(u => u.Accesses)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);
      /*  modelBuilder.Entity<Answer>()
            .HasOne(a => a.Instance)
            .WithMany(i => i.Answers)
            .HasForeignKey(a => a.InstanceId)
            .OnDelete(DeleteBehavior.Cascade);*/
            

       /* modelBuilder.Entity<Form>()
            .HasOne(f => f.Owner)
            .WithMany(owner => owner.Forms)
            .HasForeignKey(f => f.Owner)
            .OnDelete(DeleteBehavior.Cascade);*/
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Form> Forms => Set<Form>();
    public DbSet<FormAccess> FormsAccess => Set<FormAccess>();
    public DbSet<Instance> Instances => Set<Instance>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<Answer> Answers => Set<Answer>();
    public DbSet<OptionList> OptionLists => Set<OptionList>();
    public DbSet<OptionValue> OptionValues => Set<OptionValue>();
}