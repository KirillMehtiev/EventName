using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using EventName.Models;

namespace EventName.Hubs
{
    public class EventHub : Hub
    {
        private EventDbContext _context;
        public EventHub(EventDbContext context)
        {
            _context = context;
        }

        public override Task OnConnected()
        {
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            return base.OnDisconnected(stopCalled);
        }

        public void GetData()
        {
            Clients.Caller.getPeople(Data());
        }
        public async void UpdatePerson(Person updPerson)
        {
            try
            {
                _context.People.FirstOrDefault(p => p.Id == updPerson.Id).IsHere = updPerson.IsHere;
                await _context.SaveChangesAsync();
            }
            catch { }

            Clients.Others.checkinOthers(updPerson);
        }

        public async void AddPerson(string firstName, string lastName)
        {
            Person person = new Person
            {
                FirstName = firstName,
                LastName = lastName,
                IsHere = false
            };

            try
            {
                // add to bd
                _context.People.Add(person);
                await _context.SaveChangesAsync();
            }
            catch { }

            // triger update on conneted clients
            Clients.All.addPerson(person);

        }

        public void CleanList()
        {
            // todo: short-cut change in future
            foreach (var item in _context.People)
            {
                _context.People.Remove(item);
            }

            _context.SaveChanges();

            Clients.All.getPeople(Data());
        }

        private IList<Person> Data()
        {
            List<Person> list = null;

            try
            {
                list = _context.People.ToList<Person>();
            }
            catch {  }

            return list;
        }

    }
}
