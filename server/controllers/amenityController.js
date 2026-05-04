const { Amenity, Booking, User } = require('../models');
const { Op } = require('sequelize');

exports.createAmenity = async (req, res) => {
    try {
        const amenity = await Amenity.create(req.body);
        res.status(201).json(amenity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.findAll();
        res.json(amenities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.bookAmenity = async (req, res) => {
    try {
        const { amenityId, startTime, endTime } = req.body;
        
        // Basic Overlap Check
        const existingBooking = await Booking.findOne({
            where: {
                amenityId,
                status: 'CONFIRMED',
                [Op.or]: [
                    {
                        startTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    },
                    {
                        endTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    },
                    {
                        startTime: {
                            [Op.lte]: startTime
                        },
                        endTime: {
                            [Op.gte]: endTime
                        }
                    }
                ]
            }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Slot already booked' });
        }

        const amenity = await Amenity.findByPk(amenityId);
        // Calculate amount: duration in hours * chargePerHour
        const start = new Date(startTime);
        const end = new Date(endTime);
        const hours = Math.abs(end - start) / 36e5;
        const amount = hours * amenity.chargePerHour;

        const booking = await Booking.create({
            amenityId,
            residentId: req.user.id,
            startTime,
            endTime,
            amount,
            status: 'CONFIRMED'
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                { model: Amenity, as: 'amenity' },
                { model: User, as: 'resident', attributes: ['name'] }
            ]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
