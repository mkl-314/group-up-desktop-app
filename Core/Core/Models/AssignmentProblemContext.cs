using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.Extensions.Configuration;

#nullable disable

namespace AssignmentProblem.Models
{
    public partial class AssignmentProblemContext : DbContext
    {
        public AssignmentProblemContext()
        {
        }

        public AssignmentProblemContext(DbContextOptions<AssignmentProblemContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ClassDatum> ClassData { get; set; }
        public virtual DbSet<ClassExcludeDatum> ClassExcludeData { get; set; }
        public virtual DbSet<GroupProject> GroupProjects { get; set; }
        public virtual DbSet<GroupSolution> GroupSolutions { get; set; }
        public virtual DbSet<GroupSolutionStudent> GroupSolutionStudents { get; set; }
        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<StudentChoice> StudentChoices { get; set; }
        public virtual DbSet<StudentExclude> StudentExcludes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
//#if DEBUG
//            if (System.Diagnostics.Debugger.IsAttached == false)
//            {
//                System.Diagnostics.Debugger.Launch();
//            }
//#endif

            var config = new ConfigurationBuilder()
                .AddJsonFile(Path.Combine(Environment.CurrentDirectory, "appsettings.json"))
                .Build();
            if (!optionsBuilder.IsConfigured)
            {
                //optionsBuilder.UseSqlServer(config.GetSection("ConnectionStrings")["DefaultConnection"]);
                optionsBuilder.UseSqlServer(config.GetSection("ConnectionStrings")["GroupUpConnection"]);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Latin1_General_CI_AS");

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

            modelBuilder.Entity<ClassExcludeDatum>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.FirstExcludeName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SecondExcludeName)
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
                    .HasConstraintName("FK__GroupSolu__Group__4AB81AF0");

                entity.HasOne(d => d.Student)
                    .WithMany(p => p.GroupSolutionStudents)
                    .HasForeignKey(d => d.StudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__GroupSolu__Stude__4BAC3F29");
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
                    .HasConstraintName("FK__Students__GroupP__5FB337D6");
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
                    .HasConstraintName("FK__StudentCh__Choos__37A5467C");

                entity.HasOne(d => d.ChosenStudent)
                    .WithMany(p => p.StudentChoiceChosenStudents)
                    .HasForeignKey(d => d.ChosenStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StudentCh__Chose__38996AB5");
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
                    .HasConstraintName("FK__StudentEx__First__33D4B598");

                entity.HasOne(d => d.SecondStudent)
                    .WithMany(p => p.StudentExcludeSecondStudents)
                    .HasForeignKey(d => d.SecondStudentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__StudentEx__Secon__34C8D9D1");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
