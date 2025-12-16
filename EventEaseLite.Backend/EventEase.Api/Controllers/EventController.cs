using EventEase.Models;
using EventEase.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventController(EventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetEvents()
        {
            var events = await _eventService.GetAsync();
            return Ok(events);
        }
    }
}
