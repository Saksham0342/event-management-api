const express = require('express');
const router = express.Router();

const { Event } = require('../models');

const { Registration, User } = require('../models');
// Create new event
router.post('/', async (req, res) => {
  try {
    const { title, dateTime, location, capacity } = req.body;

    // Basic validations
    if (!title || !dateTime || !location || !capacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (capacity < 1 || capacity > 1000) {
      return res.status(400).json({ message: 'Capacity must be between 1 and 1000' });
    }

    const event = await Event.create({ title, dateTime, location, capacity });

    res.status(201).json({ eventId: event.id, message: 'Event created successfully' });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// Register a user for an event
router.post('/:eventId/register', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const event = await Event.findByPk(eventId, {
      include: [{ model: User }]
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check for past event
    if (new Date(event.dateTime) < new Date()) {
      return res.status(400).json({ message: 'Cannot register for past events' });
    }

    // Check if event is full
    const totalRegistrations = await Registration.count({
      where: { eventId }
    });

    if (totalRegistrations >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if user already registered
    const existing = await Registration.findOne({
      where: { userId, eventId }
    });

    if (existing) {
      return res.status(409).json({ message: 'User already registered for this event' });
    }

    await Registration.create({ userId, eventId });

    res.status(200).json({ message: 'User registered successfully for the event' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// List upcoming events (custom sorted)
router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.findAll({
      where: {
        dateTime: {
          [require('sequelize').Op.gt]: now
        }
      }
    });

    // Custom sorting: date ascending → then location alphabetical
    const sortedEvents = events.sort((a, b) => {
      const dateCompare = new Date(a.dateTime) - new Date(b.dateTime);
      if (dateCompare !== 0) return dateCompare;
      return a.location.localeCompare(b.location);
    });

    res.status(200).json(sortedEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get event details with registered users
router.get('/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: {
        model: User,
        attributes: ['id', 'name', 'email'],
        through: { attributes: [] }
      }
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Cancel a user's registration
router.post('/:eventId/cancel', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const registration = await Registration.findOne({
      where: { userId, eventId }
    });

    if (!registration) {
      return res.status(404).json({ message: 'User is not registered for this event' });
    }

    await registration.destroy();

    res.status(200).json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancellation error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Event statistics
router.get('/:eventId/stats', async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const totalRegistered = await Registration.count({ where: { eventId } });
    const remaining = event.capacity - totalRegistered;
    const percentUsed = ((totalRegistered / event.capacity) * 100).toFixed(2);

    res.status(200).json({
      totalRegistrations: totalRegistered,
      remainingCapacity: remaining,
      percentageUsed: `${percentUsed}%`
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
