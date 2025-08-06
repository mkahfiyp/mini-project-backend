import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class EventController {
    public async getAll(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 100;
            const skip = (page - 1) * limit;

            const { name, category_name, city_name, start_date, sort_by } = req.query;
            const where: any = {};

            // console.log(req.query)

            if (name) {
                where.name = { contains: String(name), mode: "insensitive" };
            }
            let categoryId
            if (category_name) {
                const category = await prisma.categories.findFirst({
                    where: { name: String(category_name) }
                })
                categoryId = category?.category_id
            }
            if (categoryId) { where.category_id = categoryId }

            let cityId
            if (city_name) {
                const city = await prisma.cities.findFirst({
                    where: { name: String(city_name) }
                })
                cityId = city?.city_id
            }
            if (cityId) { where.city_id = Number(cityId) }
            // if (start_date) { where.start_date = new Date(String(start_date)) }
            if (start_date) {
                const date = new Date(`${start_date}T00:00:00.000Z`);
                const nextDate = new Date(date);
                nextDate.setUTCDate(date.getUTCDate() + 1);
                where.start_date = {
                    gte: date,
                    lt: nextDate
                };
            }

            let orderBy: any = { start_date: "desc" };
            switch (sort_by) {
                case "Date":
                    orderBy = { start_date: "desc" };
                    break;
                case "Price Low":
                    orderBy = { price: "asc" };
                    break;
                case "Price High":
                    orderBy = { price: "desc" };
                    break;
                case "Rating":
                    orderBy = [
                        {
                            Transactions: {
                                Reviews: {
                                    _avg: { rating: "desc" }
                                }
                            }
                        }
                    ];
                    break;
                case "Popularity":
                    orderBy = { Transactions: { _count: "desc" } };
                    break;
            }

            const [events, total] = await Promise.all([
                prisma.events.findMany({
                    skip,
                    take: limit,
                    where,
                    // orderBy: { start_date: "desc" },
                    orderBy,
                    include: {
                        category: true,
                        Tickets: true,
                        city: true,
                        Transactions: {
                            include: {
                                Reviews: true
                            }
                        }
                    }
                }),
                prisma.events.count({ where })
            ]);

            if (sort_by === "Rating") {
                events.sort((a, b) => {
                    const ratingsA = a.Transactions.flatMap(t => t.Reviews.map(r => r.rating));
                    const avgA = ratingsA.length ? ratingsA.reduce((sum, r) => sum + r, 0) / ratingsA.length : 0;
                    
                    const ratingsB = b.Transactions.flatMap(t => t.Reviews.map(r => r.rating));
                    const avgB = ratingsB.length ? ratingsB.reduce((sum, r) => sum + r, 0) / ratingsB.length : 0;
                    return avgB - avgA;
                });
            }

            res.status(200).send({
                data: events,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            });
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const event = await prisma.events.findUnique({
                where: { event_ID: Number(req.params.id) },
            });
            if (!event) return res.status(404).send({ message: "Event not found" });
            res.status(200).send(event);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getByUser(req: Request, res: Response) {
        try {
            const event = await prisma.events.findMany({
                where: {
                    organizer_id: Number(res.locals.decript.id),
                },
                orderBy: {
                    start_date: "desc",
                }
            })
            if (!event) return res.status(404).send({ message: "Event not found" });
            res.status(200).send(event);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getByName(req: Request, res: Response) {
        try {
            const { name } = req.params;
            const events = await prisma.events.findMany({
                where: {
                    name: { contains: String(name), mode: "insensitive" }
                },
                include: {
                    organizer: true,
                    category: true,
                    Tickets: true,
                    city: true,
                    Transactions: {
                        include: { Reviews: true, TransactionTickets: true }
                    }
                }
            });
            if (events.length === 0) return res.status(404).send({ message: "Event not found" });
            res.status(200).send(events);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getByNamePurchase(req: Request, res: Response) {
        try {
            const { name } = req.query
            const event = await prisma.events.findFirst({
                where: {
                    name: { contains: String(name), mode: "insensitive" }
                }
            })
            if (event) {
                res.status(200).send(event)
            }
            // res.status(500).send("Data tidak ada")
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.id;
            const userRole = res.locals.decript?.role;
            console.log("++++++++++++++++++")
            console.log(userId)

            if (userRole !== "ORGANIZER") {
                return res.status(403).send({ message: "Only organizer can create event" });
            }

            const event = await prisma.events.create({
                data: {
                    ...req.body,
                    organizer_id: userId,
                },
            });
            res.status(201).send(event);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.user_id;
            const eventId = Number(req.params.id);

            const event = await prisma.events.findUnique({
                where: { event_ID: eventId },
            });
            if (!event) return res.status(404).send({ message: "Event not found" });
            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden" });
            }

            const updatedEvent = await prisma.events.update({
                where: { event_ID: eventId },
                data: req.body,
            });
            res.status(200).send(updatedEvent);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.user_id;
            const eventId = Number(req.params.id);

            const event = await prisma.events.findUnique({
                where: { event_ID: eventId },
            });
            if (!event) return res.status(404).send({ message: "Event not found" });

            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden" });
            }

            await prisma.events.delete({
                where: { event_ID: eventId },
            });
            res.status(200).send({ message: "Event deleted" });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default EventController;