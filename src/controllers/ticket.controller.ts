import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class TicketsController {
    public async getAll(req: Request, res: Response) {
        try {
            const tickets = await prisma.tickets.findMany();
            res.status(200).send(tickets);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const ticket = await prisma.tickets.findUnique({
                where: { ticket_id: Number(req.params.id) },
            });
            if (!ticket) return res.status(404).send({ message: "Ticket not found" });
            res.status(200).send(ticket);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getByUser(req: Request, res: Response) {
        try {
            const ticket = await prisma.tickets.findMany({
                where: {
                    Event: {
                        organizer_id: Number(res.locals.decript.id),
                    }
                },
                include: {
                    Event: true,
                },
                orderBy: {
                    Event: {
                        start_date: "desc",
                    },
                },
            })
            res.status(200).send(ticket)
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.id;
            const { event_id, start_date, end_date } = req.body;

            const event = await prisma.events.findUnique({ where: { event_ID: event_id } });
            if (!event) return res.status(404).send({ message: "Event not found" });
            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden" });
            }

            const ticket = await prisma.tickets.create({
                data: {
                    ...req.body,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                },
            });
            res.status(201).send(ticket);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.user_id;
            const ticketId = Number(req.params.id);

            const ticket = await prisma.tickets.findUnique({
                where: { ticket_id: ticketId },
                include: { Event: true }
            });
            if (!ticket) return res.status(404).send({ message: "Ticket not found" });

            const event = await prisma.events.findUnique({
                where: { event_ID: ticket.event_id }
            });
            if (!event) return res.status(404).send({ message: "Event not found" });
            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden" });
            }

            const { start_date, end_date } = req.body;
            const updatedTicket = await prisma.tickets.update({
                where: { ticket_id: ticketId },
                data: {
                    ...req.body,
                    start_date: start_date ? new Date(start_date) : undefined,
                    end_date: end_date ? new Date(end_date) : undefined,
                },
            });
            res.status(200).send(updatedTicket);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.user_id;
            const ticketId = Number(req.params.id);

            const ticket = await prisma.tickets.findUnique({
                where: { ticket_id: ticketId }
            });
            if (!ticket) return res.status(404).send({ message: "Ticket not found" });

            const event = await prisma.events.findUnique({
                where: { event_ID: ticket.event_id }
            });
            if (!event) return res.status(404).send({ message: "Event not found" });
            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden" });
            }

            await prisma.tickets.delete({
                where: { ticket_id: ticketId },
            });
            res.status(200).send({ message: "Ticket deleted" });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default TicketsController;