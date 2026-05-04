const db = require('./models');
const bcrypt = require('bcrypt');

const seed = async () => {
    try {
        await db.sequelize.sync({ force: true }); // Reset DB
        console.log('Database synced...');

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        // 1 Admin
        await db.User.create({
            name: 'Admin User',
            email: 'admin@society.com',
            password,
            role: 'ADMIN',
            phoneNumber: '9999999999'
        });

        // 1 Security
        await db.User.create({
            name: 'Security Guard',
            email: 'security@society.com',
            password,
            role: 'SECURITY',
            phoneNumber: '8888888888'
        });

        // 3 Residents
        const residents = [
            { name: 'John Doe', email: 'john@society.com', apt: 'A-101' },
            { name: 'Jane Smith', email: 'jane@society.com', apt: 'A-102' },
            { name: 'Mike Ross', email: 'mike@society.com', apt: 'B-201' },
        ];

        for (const res of residents) {
            await db.User.create({
                name: res.name,
                email: res.email,
                password,
                role: 'RESIDENT',
                apartmentNumber: res.apt,
                phoneNumber: '7777777777'
            });
        }
        
        // Add some Amenities
        await db.Amenity.create({ name: 'Club House', chargePerHour: 50, description: 'Community Hall for events' });
        await db.Amenity.create({ name: 'Tennis Court', chargePerHour: 20, description: 'Standard size court' });
        await db.Amenity.create({ name: 'Swimming Pool', chargePerHour: 10, description: 'Adult and Kids pool' });

        console.log('Seed data inserted successfully!');
        process.exit();
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
};

seed();
