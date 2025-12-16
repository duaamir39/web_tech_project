using EventEase.Models;
using EventEase.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MongoDB.Driver; 
namespace EventEase.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
     public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly EventService _eventService;
        
        public BookingController(BookingService bookingService, EventService eventService)
        {
            _bookingService = bookingService;
            _eventService = eventService;
        }
        
        [HttpPost]
        public async Task<IActionResult> BookTicket([FromBody] BookTicketRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User identity not found in token." });
            }

            var eventToBook = await _eventService.GetAsync(request.EventId);

            if (eventToBook == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            if (eventToBook.AvailableSeats <= 0)
            {
                return BadRequest(new { message = "This event is sold out." });
            }

            var newBooking = new Booking
            {
                UserId = userId,
                EventId = request.EventId,
                BookingDate = DateTime.UtcNow
            };
            
            await _bookingService.CreateAsync(newBooking);

            var filter = Builders<Event>.Filter.Eq(e => e.Id, request.EventId);
            var update = Builders<Event>.Update.Inc(e => e.AvailableSeats, -1);
            
            await _eventService.UpdateSeatsAsync(filter, update); 
            return CreatedAtAction(nameof(GetMyBookings), new { userId = userId }, newBooking);
        }
        
        [HttpGet("MyBookings")]
        public async Task<ActionResult<List<Booking>>> GetMyBookings()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User identity not found in token." });
            }
            
            var bookings = await _bookingService.GetByUserIdAsync(userId);
            
            return Ok(bookings);
        }
    }
}