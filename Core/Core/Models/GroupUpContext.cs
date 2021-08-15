using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class GroupUpContext : DbContext
    {
        public GroupUpContext()
        {
        }

        public GroupUpContext(DbContextOptions<GroupUpContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ClassDatum> ClassData { get; set; }
        public virtual DbSet<GroupProject> GroupProjects { get; set; }
        public virtual DbSet<GroupSolution> GroupSolutions { get; set; }
        public virtual DbSet<GroupSolutionStudent> GroupSolutionStudents { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<StudentChoice> StudentChoices { get; set; }
        public virtual DbSet<StudentExclude> StudentExcludes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            // If running swagger, change directory to Enviornment.CurrentDirectory
            //var config = new ConfigurationBuilder()
            //    .AddJsonFile(Path.Combine(Environment.CurrentDirectory, "appsettings.json"))
            //    .Build();
            if (!optionsBuilder.IsConfigured)
            {
                //TODO Use appsettings
                /*config.GetSection("ConnectionStrings")["GroupUpConnection"]*/
                optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=GroupUp;Trusted_Connection=True;MultiSubnetFailover=False");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<ClassDatum>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Choice1)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Choice2)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Choice3).HasMaxLength(50);

                entity.Property(e => e.Choice4).HasMaxLength(50);

                entity.Property(e => e.FirstName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<GroupProject>(entity =>
            {
                entity.Property(e => e.GroupProjectId).HasColumnName("GroupProjectID");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.GroupProjectName)
                    .HasMaxLength(255)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<GroupSolution>(entity =>
            {
                entity.Property(e => e.GroupSolutionId).HasColumnName("GroupSolutionID");

                entity.Property(e => e.GroupProjectId).HasColumnName("GroupProjectID");
            });

            modelBuilder.Entity<GroupSolutionStudent>(entity =>
            {
                entity.Property(e => e.GroupSolutionStudentId).HasColumnName("GroupSolutionStudentID");

                entity.Property(e => e.GroupSolutionId).HasColumnName("GroupSolutionID");

                entity.Property(e => e.StudentId).HasColumnName("StudentID");

                entity.HasOne(d => d.GroupSolution)
                    .WithMany(p => p.GroupSolutionStudents)
                    .HasForeignKey(d => d.GroupSolutionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__GroupSolu__Group__34C8D9D1");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.GroupSolutionStudents)
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__GroupSolu__Stude__35BCFE0A");
            });

            modelBuilder.Entity<Student>(entity =>
            {
                entity.Property(e => e.StudentId).HasColumnName("StudentID");

                entity.Property(e => e.FirstName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.GroupProjectId).HasColumnName("GroupProjectID");

                entity.Property(e => e.LastName)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.GroupProject)
                    .WithMany(p => p.Students)
                    .HasForeignKey(d => d.GroupProjectId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Students__GroupP__286302EC");
            });

            modelBuilder.Entity<StudentChoice>(entity =>
            {
                entity.ToTable("StudentChoice");

                entity.Property(e => e.StudentChoiceId).HasColumnName("StudentChoiceID");

                entity.Property(e => e.ChooserStudentId).HasColumnName("ChooserStudentID");

                entity.Property(e => e.ChosenStudentId).HasColumnName("ChosenStudentID");

                entity.HasOne(d => d.ChooserStudent)
                    .WithMany(p => p.StudentChoiceChooserStudents)
                    .HasForeignKey(d => d.ChooserStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StudentCh__Choos__2F10007B");

                entity.HasOne(d => d.ChosenStudent)
                    .WithMany(p => p.StudentChoiceChosenStudents)
                    .HasForeignKey(d => d.ChosenStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StudentCh__Chose__300424B4");
            });

            modelBuilder.Entity<StudentExclude>(entity =>
            {
                entity.ToTable("StudentExclude");

                entity.Property(e => e.StudentExcludeId).HasColumnName("StudentExcludeID");

                entity.Property(e => e.FirstStudentId).HasColumnName("FirstStudentID");

                entity.Property(e => e.SecondStudentId).HasColumnName("SecondStudentID");

                entity.HasOne(d => d.FirstStudent)
                    .WithMany(p => p.StudentExcludeFirstStudents)
                    .HasForeignKey(d => d.FirstStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StudentEx__First__2B3F6F97");

                entity.HasOne(d => d.SecondStudent)
                    .WithMany(p => p.StudentExcludeSecondStudents)
                    .HasForeignKey(d => d.SecondStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StudentEx__Secon__2C3393D0");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
