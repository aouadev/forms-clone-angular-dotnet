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

        int count = 0;
        
        modelBuilder.Entity<User>().HasData(
            new User { Id= ++count, Email = "ben@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Benoit", LastName = "Penelle" },
            new User { Id=++count, Email = "bruno@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Bruno", LastName = "Lacroix" },
            new User { Id=++count, Email = "boris@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Boris", LastName = "Verhaegen" },
            new User { Id=++count, Email = "admin@epfc.eu", Password = "Password1,", Role = Role.Admin, FirstName = "Admin", LastName = "Administrator" },
            new User { Id=++count, Email = "guest@epfc.eu", Password = "N/A", Role = Role.Guest, FirstName = "Guest", LastName = "No Name" },
            new User { Id=++count, Email = "xavier@epfc.eu", Password = "Password1,", Role = Role.User, FirstName = "Xavier", LastName = "Pigeolet" }
        );
    }

    public DbSet<User> Users => Set<User>();
}