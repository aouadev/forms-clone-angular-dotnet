using Microsoft.EntityFrameworkCore;

namespace prid_2425_f06.Models;
public class FormContext : DbContext
{
    public FormContext(DbContextOptions<FormContext> options)
        : base(options) {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>().HasIndex(u => new{u.FirstName,u.LastName}).IsUnique();
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<FormAccess>().HasKey(a => new{a.FormId, a.UserId});

       /* int count = 0;
        
        modelBuilder.Entity<User>().HasData(
            new User { Id= ++count, Email = "ben@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Benoit", LastName = "Penelle" },
            new User { Id=++count, Email = "bruno@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Bruno", LastName = "Lacroix" },
            new User { Id=++count, Email = "boris@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Boris", LastName = "Verhaegen" },
            new User { Id=++count, Email = "admin@epfc.eu", Password = "Password1,", Role = Role.Admin, FirstName = "Admin", LastName = "Administrator" },
            new User { Id=++count, Email = "guest@epfc.eu", Password = "N/A", Role = Role.Guest, FirstName = "Guest", LastName = "No Name" },
            new User { Id=++count, Email = "xavier@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Xavier", LastName = "Pigeolet" }
        );
        modelBuilder.Entity<Form>().HasData(
            new Form { FormId = 1, Title = "form test1", Description = "this form is a test", OwnerId = 1, IsPublic = true},
            new Form { FormId = 2, Title = "form test2", Description = "this form is a test2", OwnerId = 1, IsPublic = true},
             new Form { FormId = 3, Title = "form test3", Description = "this form is a test3", OwnerId = 2, IsPublic = true},
            new Form { FormId = 4, Title = "form test4", Description = "this form is a test4", OwnerId = 3, IsPublic = true},
             new Form { FormId = 5, Title = "form test5", Description = "this form is a test5", OwnerId = 2, IsPublic = true},
            new Form { FormId = 6, Title = "form test6", Description = "this form is a test6", OwnerId = 3, IsPublic = true}
        );
        modelBuilder.Entity<Instance>().HasData(

        );
        modelBuilder.Entity<FormAccess>().HasData(
            new FormAccess{ FormId = 3, UserId = 1, AccessType = AccessType.User},
            new FormAccess{ FormId = 4, UserId = 1, AccessType = AccessType.User},
            new FormAccess{ FormId = 5, UserId = 1, AccessType = AccessType.User}
        );*/
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Form> Forms => Set<Form>();
    public DbSet<FormAccess> FormsAccess => Set<FormAccess>();
    public DbSet<Instance> Instances => Set<Instance>();
}