import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class VoucherController {
    public async getAll(req: Request, res: Response) {
        try {
            const vouchers = await prisma.vouchers.findMany();
            res.status(200).send(vouchers);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getAllByUser(req: Request, res: Response) {
        try {
            const voucher = await prisma.vouchers.findMany({
                where: {
                    Event: {
                        organizer_id: Number(res.locals.decript.id)
                    }
                }, include: {
                    Event: true,
                }
            })
            res.status(200).send(voucher)
        } catch (error) {
            res.status(500).send(error)
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const voucher = await prisma.vouchers.findUnique({
                where: { voucher_id: Number(req.params.id) },
            });
            if (!voucher) return res.status(404).send({ message: "Voucher not found" });
            res.status(200).send(voucher);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.id;
            const { event_id, start_date, end_date } = req.body;

            const event = await prisma.events.findUnique({
                where: { event_ID: event_id }
            });
            if (!event) return res.status(404).send({ message: "Event not found" });

            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden: You are not the organizer of this event" });
            }

            if (new Date(start_date) >= new Date(end_date)) {
                return res.status(400).send({ message: "Start date must be before end date" });
            }

            const voucher = await prisma.vouchers.create({
                data: {
                    ...req.body,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                },
            });
            res.status(201).send(voucher);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.user_id;
            const voucherId = Number(req.params.id);

            const voucher = await prisma.vouchers.findUnique({
                where: { voucher_id: voucherId }
            });
            if (!voucher) return res.status(404).send({ message: "Voucher not found" });

            const event = await prisma.events.findUnique({
                where: { event_ID: voucher.event_id }
            });
            if (!event) return res.status(404).send({ message: "Event not found" });
            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden: You are not the organizer of this event" });
            }

            const { start_date, end_date } = req.body;
            const updatedVoucher = await prisma.vouchers.update({
                where: { voucher_id: voucherId },
                data: {
                    ...req.body,
                    start_date: start_date ? new Date(start_date) : undefined,
                    end_date: end_date ? new Date(end_date) : undefined,
                },
            });
            res.status(200).send(updatedVoucher);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const userId = res.locals.decript?.user_id;
            const voucherId = Number(req.params.id);

            const voucher = await prisma.vouchers.findUnique({
                where: { voucher_id: voucherId }
            });
            if (!voucher) return res.status(404).send({ message: "Voucher not found" });

            const event = await prisma.events.findUnique({
                where: { event_ID: voucher.event_id }
            });
            if (!event) return res.status(404).send({ message: "Event not found" });
            if (event.organizer_id !== userId) {
                return res.status(403).send({ message: "Forbidden: You are not the organizer of this event" });
            }

            await prisma.vouchers.delete({
                where: { voucher_id: voucherId },
            });
            res.status(200).send({ message: "Voucher deleted" });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default VoucherController;