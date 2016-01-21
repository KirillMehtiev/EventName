using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;

namespace EventName.Models
{
    public class EventDbContext : DbContext
    {
        public DbSet<Person> People { get; set; }

        public EventDbContext(DbContextOptions options) : base(options)
        {

        }
    }
}
