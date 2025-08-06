const { randomUUID } = require('crypto');
const { PrismaClient } = require('./generated/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // 1. Seed Cities (harus pertama karena akan direferensi oleh Events)
    console.log('🏙️ Seeding Cities...');
    const cities = await Promise.all([
        prisma.cities.create({
            data: {
                name: 'Jakarta',
                province: 'DKI Jakarta',
                country: 'Indonesia'
            }
        }),
        prisma.cities.create({
            data: {
                name: 'Bandung',
                province: 'Jawa Barat',
                country: 'Indonesia'
            }
        }),
        prisma.cities.create({
            data: {
                name: 'Surabaya',
                province: 'Jawa Timur',
                country: 'Indonesia'
            }
        }),
        prisma.cities.create({
            data: {
                name: 'Yogyakarta',
                province: 'DI Yogyakarta',
                country: 'Indonesia'
            }
        }),
        prisma.cities.create({
            data: {
                name: 'Medan',
                province: 'Sumatera Utara',
                country: 'Indonesia'
            }
        }),
        prisma.cities.create({
            data: {
                name: 'Bali',
                province: 'Bali',
                country: 'Indonesia'
            }
        })
    ]);

    // 2. Seed Users
    console.log('👤 Seeding Users...');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await Promise.all([
        prisma.users.create({
            data: {
                name: 'John Doe',
                username: 'john_organizer',
                email: 'john@example.com',
                password: hashedPassword,
                phone: '+6281234567890',
                role: 'ORGANIZER',
                points: 1000,
                referal_code: 'JOHN2025',
                profile_picture: 'https://example.com/john.jpg'
            }
        }),
        prisma.users.create({
            data: {
                name: 'Jane Smith',
                username: 'jane_customer',
                email: 'jane@example.com',
                password: hashedPassword,
                phone: '+6281234567891',
                role: 'CUSTOMER',
                points: 500,
                referal_code: 'JANE2025',
                profile_picture: 'https://example.com/jane.jpg'
            }
        }),
        prisma.users.create({
            data: {
                name: 'Admin User',
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                phone: '+6281234567892',
                role: 'ADMIN',
                points: 0,
                referal_code: 'ADMIN2025'
            }
        }),
        prisma.users.create({
            data: {
                name: 'Alice Johnson',
                username: 'alice_organizer',
                email: 'alice@example.com',
                password: hashedPassword,
                phone: '+6281234567893',
                role: 'ORGANIZER',
                points: 750,
                referal_code: 'ALICE2025'
            }
        }),
        prisma.users.create({
            data: {
                name: 'Bob Wilson',
                username: 'bob_customer',
                email: 'bob@example.com',
                password: hashedPassword,
                phone: '+6281234567894',
                role: 'CUSTOMER',
                points: 300,
                referal_code: 'BOB2025'
            }
        }),
        prisma.users.create({
            data: {
                name: 'Charlie Brown',
                username: 'charlie_organizer',
                email: 'charlie@example.com',
                password: hashedPassword,
                phone: '+6281234567895',
                role: 'ORGANIZER',
                points: 1200,
                referal_code: 'CHARLIE2025'
            }
        }),
        prisma.users.create({
            data: {
                name: 'Diana Prince',
                username: 'diana_customer',
                email: 'diana@example.com',
                password: hashedPassword,
                phone: '+6281234567896',
                role: 'CUSTOMER',
                points: 800,
                referal_code: 'DIANA2025'
            }
        })
    ]);

    // 3. Seed Categories
    console.log('📂 Seeding Categories...');
    const categories = await Promise.all([
        prisma.categories.create({
            data: {
                name: 'Music',
                description: 'Music concerts and festivals'
            }
        }),
        prisma.categories.create({
            data: {
                name: 'Sports',
                description: 'Sports events and competitions'
            }
        }),
        prisma.categories.create({
            data: {
                name: 'Technology',
                description: 'Tech conferences and workshops'
            }
        }),
        prisma.categories.create({
            data: {
                name: 'Business',
                description: 'Business seminars and networking events'
            }
        }),
        prisma.categories.create({
            data: {
                name: 'Arts & Culture',
                description: 'Art exhibitions and cultural events'
            }
        }),
        prisma.categories.create({
            data: {
                name: 'Food & Drink',
                description: 'Culinary events and food festivals'
            }
        }),
        prisma.categories.create({
            data: {
                name: 'Education',
                description: 'Educational workshops and seminars'
            }
        })
    ]);

    // 4. Seed Events
    console.log('🎉 Seeding Events...');
    const events = await Promise.all([
        prisma.events.create({
            data: {
                organizer_id: users[0].user_id, // John (Organizer)
                category_id: categories[0].category_id, // Music
                city_id: cities[0].city_id, // Jakarta
                name: 'Jakarta Music Festival 2025',
                deskripsi: 'The biggest music festival in Jakarta featuring local and international artists',
                price: 500000,
                start_date: new Date('2025-12-15T18:00:00Z'),
                end_date: new Date('2025-12-17T23:00:00Z'),
                location: 'Gelora Bung Karno Stadium',
                image: 'https://example.com/music-festival.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[3].user_id, // Alice (Organizer)
                category_id: categories[1].category_id, // Sports
                city_id: cities[0].city_id, // Jakarta
                name: 'Marathon Jakarta 2025',
                deskripsi: 'Annual marathon event in Jakarta with 5K, 10K, and full marathon categories',
                price: 150000,
                start_date: new Date('2025-11-20T06:00:00Z'),
                end_date: new Date('2025-11-20T12:00:00Z'),
                location: 'Monas Area',
                image: 'https://example.com/marathon.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[0].user_id, // John (Organizer)
                category_id: categories[2].category_id, // Technology
                city_id: cities[0].city_id, // Jakarta
                name: 'Tech Conference Indonesia 2025',
                deskripsi: 'Leading technology conference featuring AI, blockchain, and startup trends',
                price: 750000,
                start_date: new Date('2025-10-25T09:00:00Z'),
                end_date: new Date('2025-10-27T17:00:00Z'),
                location: 'Jakarta Convention Center',
                image: 'https://example.com/tech-conf.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[3].user_id, // Alice (Organizer)
                category_id: categories[3].category_id, // Business
                city_id: cities[1].city_id, // Bandung
                name: 'Startup Summit Bandung 2025',
                deskripsi: 'Business networking event for startups and entrepreneurs',
                price: 300000,
                start_date: new Date('2025-11-10T10:00:00Z'),
                end_date: new Date('2025-11-10T18:00:00Z'),
                location: 'Trans Luxury Hotel',
                image: 'https://example.com/startup-summit.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[5].user_id, // Charlie (Organizer)
                category_id: categories[4].category_id, // Arts & Culture
                city_id: cities[3].city_id, // Yogyakarta
                name: 'Yogyakarta Art Festival 2025',
                deskripsi: 'Traditional and contemporary art exhibition in cultural city of Yogyakarta',
                price: 75000,
                start_date: new Date('2025-12-01T10:00:00Z'),
                end_date: new Date('2025-12-03T18:00:00Z'),
                location: 'Taman Budaya Yogyakarta',
                image: 'https://example.com/art-festival.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[5].user_id, // Charlie (Organizer)
                category_id: categories[5].category_id, // Food & Drink
                city_id: cities[5].city_id, // Bali
                name: 'Bali Food Festival 2025',
                deskripsi: 'Culinary festival showcasing Indonesian and international cuisine',
                price: 200000,
                start_date: new Date('2025-11-25T17:00:00Z'),
                end_date: new Date('2025-11-27T22:00:00Z'),
                location: 'Sanur Beach Area',
                image: 'https://example.com/food-festival.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[0].user_id, // John (Organizer)
                category_id: categories[6].category_id, // Education
                city_id: cities[2].city_id, // Surabaya
                name: 'Digital Marketing Workshop Surabaya 2025',
                deskripsi: 'Comprehensive workshop on digital marketing strategies and tools',
                price: 350000,
                start_date: new Date('2025-10-15T09:00:00Z'),
                end_date: new Date('2025-10-15T17:00:00Z'),
                location: 'Grand City Convention Center',
                image: 'https://example.com/marketing-workshop.jpg'
            }
        }),
        prisma.events.create({
            data: {
                organizer_id: users[3].user_id, // Alice (Organizer)
                category_id: categories[1].category_id, // Sports
                city_id: cities[4].city_id, // Medan
                name: 'Medan Basketball Championship 2025',
                deskripsi: 'Regional basketball championship for amateur and semi-professional teams',
                price: 50000,
                start_date: new Date('2025-11-05T08:00:00Z'),
                end_date: new Date('2025-11-07T18:00:00Z'),
                location: 'Medan Sports Hall',
                image: 'https://example.com/basketball.jpg'
            }
        })
    ]);

    // 5. Seed Tickets
    console.log('🎫 Seeding Tickets...');
    const tickets = await Promise.all([
        // Jakarta Music Festival Tickets
        prisma.tickets.create({
            data: {
                event_id: events[0].event_ID,
                name: 'Early Bird Ticket',
                kategori: 'General Admission',
                deskripsi: 'Early bird pricing for general admission',
                harga: 400000,
                kuota: 1000,
                aktif: true,
                start_date: new Date('2025-08-01T00:00:00Z'),
                end_date: new Date('2025-10-31T23:59:59Z')
            }
        }),
        prisma.tickets.create({
            data: {
                event_id: events[0].event_ID,
                name: 'VIP Ticket',
                kategori: 'VIP',
                deskripsi: 'VIP access with premium amenities',
                harga: 1000000,
                kuota: 200,
                aktif: true,
                start_date: new Date('2025-08-01T00:00:00Z'),
                end_date: new Date('2025-12-10T23:59:59Z')
            }
        }),
        // Marathon Jakarta Tickets
        prisma.tickets.create({
            data: {
                event_id: events[1].event_ID,
                name: '5K Fun Run',
                kategori: '5K',
                deskripsi: '5 kilometer fun run for all ages',
                harga: 100000,
                kuota: 500,
                aktif: true,
                start_date: new Date('2025-09-01T00:00:00Z'),
                end_date: new Date('2025-11-15T23:59:59Z')
            }
        }),
        prisma.tickets.create({
            data: {
                event_id: events[1].event_ID,
                name: 'Full Marathon',
                kategori: '42K',
                deskripsi: 'Full 42 kilometer marathon challenge',
                harga: 200000,
                kuota: 300,
                aktif: true,
                start_date: new Date('2025-09-01T00:00:00Z'),
                end_date: new Date('2025-11-15T23:59:59Z')
            }
        }),
        // Tech Conference Tickets
        prisma.tickets.create({
            data: {
                event_id: events[2].event_ID,
                name: 'Regular Pass',
                kategori: 'Regular',
                deskripsi: 'Access to all sessions and networking',
                harga: 750000,
                kuota: 800,
                aktif: true,
                start_date: new Date('2025-08-15T00:00:00Z'),
                end_date: new Date('2025-10-20T23:59:59Z')
            }
        }),
        prisma.tickets.create({
            data: {
                event_id: events[2].event_ID,
                name: 'Premium Pass',
                kategori: 'Premium',
                deskripsi: 'Premium access with workshop materials and lunch',
                harga: 1200000,
                kuota: 200,
                aktif: true,
                start_date: new Date('2025-08-15T00:00:00Z'),
                end_date: new Date('2025-10-20T23:59:59Z')
            }
        }),
        // Startup Summit Tickets
        prisma.tickets.create({
            data: {
                event_id: events[3].event_ID,
                name: 'Standard Ticket',
                kategori: 'Standard',
                deskripsi: 'Standard access to all sessions',
                harga: 300000,
                kuota: 400,
                aktif: true,
                start_date: new Date('2025-09-01T00:00:00Z'),
                end_date: new Date('2025-11-05T23:59:59Z')
            }
        }),
        // Art Festival Tickets
        prisma.tickets.create({
            data: {
                event_id: events[4].event_ID,
                name: 'Day Pass',
                kategori: 'Daily',
                deskripsi: 'Single day access to exhibitions',
                harga: 75000,
                kuota: 200,
                aktif: true,
                start_date: new Date('2025-10-01T00:00:00Z'),
                end_date: new Date('2025-11-30T23:59:59Z')
            }
        }),
        prisma.tickets.create({
            data: {
                event_id: events[4].event_ID,
                name: 'Festival Pass',
                kategori: 'Full Access',
                deskripsi: 'Full 3-day festival access',
                harga: 150000,
                kuota: 150,
                aktif: true,
                start_date: new Date('2025-10-01T00:00:00Z'),
                end_date: new Date('2025-11-30T23:59:59Z')
            }
        }),
        // Food Festival Tickets
        prisma.tickets.create({
            data: {
                event_id: events[5].event_ID,
                name: 'Tasting Pass',
                kategori: 'Tasting',
                deskripsi: 'Access to food tasting booths',
                harga: 200000,
                kuota: 300,
                aktif: true,
                start_date: new Date('2025-10-01T00:00:00Z'),
                end_date: new Date('2025-11-20T23:59:59Z')
            }
        }),
        // Digital Marketing Workshop Tickets
        prisma.tickets.create({
            data: {
                event_id: events[6].event_ID,
                name: 'Workshop Ticket',
                kategori: 'Workshop',
                deskripsi: 'Full day workshop with materials',
                harga: 350000,
                kuota: 100,
                aktif: true,
                start_date: new Date('2025-08-15T00:00:00Z'),
                end_date: new Date('2025-10-10T23:59:59Z')
            }
        }),
        // Basketball Championship Tickets
        prisma.tickets.create({
            data: {
                event_id: events[7].event_ID,
                name: 'Tournament Pass',
                kategori: 'Tournament',
                deskripsi: 'Access to all tournament matches',
                harga: 50000,
                kuota: 500,
                aktif: true,
                start_date: new Date('2025-09-01T00:00:00Z'),
                end_date: new Date('2025-11-01T23:59:59Z')
            }
        })
    ]);

    // 6. Seed Vouchers
    console.log('🎟️ Seeding Vouchers...');
    const vouchers = await Promise.all([
        prisma.vouchers.create({
            data: {
                event_id: events[0].event_ID,
                code: 'MUSIC20',
                discount_value: 20,
                min_purchase: 500000,
                max_discount: 100000,
                start_date: new Date('2025-08-01T00:00:00Z'),
                end_date: new Date('2025-12-15T23:59:59Z')
            }
        }),
        prisma.vouchers.create({
            data: {
                event_id: events[1].event_ID,
                code: 'RUNNER15',
                discount_value: 15,
                min_purchase: 150000,
                max_discount: 50000,
                start_date: new Date('2025-09-01T00:00:00Z'),
                end_date: new Date('2025-11-20T23:59:59Z')
            }
        }),
        prisma.vouchers.create({
            data: {
                event_id: events[2].event_ID,
                code: 'TECH25',
                discount_value: 25,
                min_purchase: 700000,
                max_discount: 200000,
                start_date: new Date('2025-08-15T00:00:00Z'),
                end_date: new Date('2025-10-25T23:59:59Z')
            }
        }),
        prisma.vouchers.create({
            data: {
                event_id: events[3].event_ID,
                code: 'STARTUP10',
                discount_value: 10,
                min_purchase: 250000,
                max_discount: 30000,
                start_date: new Date('2025-09-01T00:00:00Z'),
                end_date: new Date('2025-11-10T23:59:59Z')
            }
        }),
        prisma.vouchers.create({
            data: {
                event_id: events[4].event_ID,
                code: 'ART30',
                discount_value: 30,
                min_purchase: 100000,
                max_discount: 25000,
                start_date: new Date('2025-10-01T00:00:00Z'),
                end_date: new Date('2025-12-01T23:59:59Z')
            }
        }),
        prisma.vouchers.create({
            data: {
                event_id: events[5].event_ID,
                code: 'FOOD15',
                discount_value: 15,
                min_purchase: 180000,
                max_discount: 40000,
                start_date: new Date('2025-10-01T00:00:00Z'),
                end_date: new Date('2025-11-25T23:59:59Z')
            }
        })
    ]);

    // 7. Seed Transactions
    console.log('💳 Seeding Transactions...');
    const transactions = await Promise.all([
        prisma.transactions.create({
            data: {
                transaction_code: randomUUID().slice(0, 6),
                event_id: events[0].event_ID,
                ticket_id: tickets[0].ticket_id,
                voucher_id: vouchers[0].voucher_id,
                user_id: users[1].user_id, // Jane (Customer)
                used_point: 100,
                status: 'done',
                payment_proof: 'https://example.com/payment1.jpg',
                payment_deadline: new Date('2025-09-15T23:59:59Z')
            }
        }),
        prisma.transactions.create({
            data: {
                transaction_code: randomUUID().slice(0, 6),
                event_id: events[1].event_ID,
                ticket_id: tickets[2].ticket_id,
                voucher_id: vouchers[1].voucher_id,
                user_id: users[4].user_id, // Bob (Customer)
                used_point: 50,
                status: 'waiting_payment',
                payment_deadline: new Date('2025-10-15T23:59:59Z')
            }
        }),
        prisma.transactions.create({
            data: {
                transaction_code: randomUUID().slice(0, 6),
                event_id: events[2].event_ID,
                ticket_id: tickets[4].ticket_id,
                voucher_id: vouchers[2].voucher_id,
                user_id: users[1].user_id, // Jane (Customer)
                used_point: 200,
                status: 'done',
                payment_proof: 'https://example.com/payment2.jpg',
                payment_deadline: new Date('2025-09-20T23:59:59Z')
            }
        }),
        prisma.transactions.create({
            data: {
                transaction_code: randomUUID().slice(0, 6),
                event_id: events[3].event_ID,
                ticket_id: tickets[6].ticket_id,
                voucher_id: vouchers[3].voucher_id,
                user_id: users[6].user_id, // Diana (Customer)
                used_point: 75,
                status: 'done',
                payment_proof: 'https://example.com/payment3.jpg',
                payment_deadline: new Date('2025-10-01T23:59:59Z')
            }
        }),
        prisma.transactions.create({
            data: {
                transaction_code: randomUUID().slice(0, 6),
                event_id: events[4].event_ID,
                ticket_id: tickets[8].ticket_id,
                voucher_id: vouchers[4].voucher_id,
                user_id: users[4].user_id, // Bob (Customer)
                used_point: 25,
                status: 'waiting_payment',
                payment_deadline: new Date('2025-11-15T23:59:59Z')
            }
        }),
        prisma.transactions.create({
            data: {
                transaction_code: randomUUID().slice(0, 6),
                event_id: events[5].event_ID,
                ticket_id: tickets[9].ticket_id,
                voucher_id: vouchers[5].voucher_id,
                user_id: users[6].user_id, // Diana (Customer)
                used_point: 100,
                status: 'done',
                payment_proof: 'https://example.com/payment4.jpg',
                payment_deadline: new Date('2025-10-20T23:59:59Z')
            }
        })
    ]);

    // 8. Seed Transaction Tickets
    console.log('🎪 Seeding Transaction Tickets...');
    const transactionTickets = await Promise.all([
        prisma.transactionTicket.create({
            data: {
                transaction_id: transactions[0].transaction_id,
                ticket_id: tickets[0].ticket_id,
                quantity: 2
            }
        }),
        prisma.transactionTicket.create({
            data: {
                transaction_id: transactions[1].transaction_id,
                ticket_id: tickets[2].ticket_id,
                quantity: 1
            }
        }),
        prisma.transactionTicket.create({
            data: {
                transaction_id: transactions[2].transaction_id,
                ticket_id: tickets[4].ticket_id,
                quantity: 1
            }
        }),
        prisma.transactionTicket.create({
            data: {
                transaction_id: transactions[3].transaction_id,
                ticket_id: tickets[6].ticket_id,
                quantity: 3
            }
        }),
        prisma.transactionTicket.create({
            data: {
                transaction_id: transactions[4].transaction_id,
                ticket_id: tickets[8].ticket_id,
                quantity: 2
            }
        }),
        prisma.transactionTicket.create({
            data: {
                transaction_id: transactions[5].transaction_id,
                ticket_id: tickets[9].ticket_id,
                quantity: 1
            }
        })
    ]);

    // 9. Seed Reviews
    console.log('⭐ Seeding Reviews...');
    const reviews = await Promise.all([
        prisma.reviews.create({
            data: {
                user_id: users[1].user_id, // Jane
                transaction_id: transactions[0].transaction_id,
                rating: 5,
                komen: 'Amazing music festival! Great lineup and organization. Will definitely come back next year.'
            }
        }),
        prisma.reviews.create({
            data: {
                user_id: users[1].user_id, // Jane
                transaction_id: transactions[2].transaction_id,
                rating: 4,
                komen: 'Very informative tech conference. Learned a lot about AI trends and networking was great.'
            }
        }),
        prisma.reviews.create({
            data: {
                user_id: users[6].user_id, // Diana
                transaction_id: transactions[3].transaction_id,
                rating: 5,
                komen: 'Excellent startup summit! Met many inspiring entrepreneurs and investors.'
            }
        }),
        prisma.reviews.create({
            data: {
                user_id: users[6].user_id, // Diana
                transaction_id: transactions[5].transaction_id,
                rating: 4,
                komen: 'Great food festival with diverse culinary options. The Balinese atmosphere was fantastic!'
            }
        })
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`🏙️ Created ${cities.length} cities`);
    console.log(`👤 Created ${users.length} users`);
    console.log(`📂 Created ${categories.length} categories`);
    console.log(`🎉 Created ${events.length} events`);
    console.log(`🎫 Created ${tickets.length} tickets`);
    console.log(`🎟️ Created ${vouchers.length} vouchers`);
    console.log(`💳 Created ${transactions.length} transactions`);
    console.log(`🎪 Created ${transactionTickets.length} transaction tickets`);
    console.log(`⭐ Created ${reviews.length} reviews`);
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });