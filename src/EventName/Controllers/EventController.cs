using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace EventName.Controllers
{
    public class EventController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

    }
}
