import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class CategoriesController {
    public async getAll(req: Request, res: Response) {
        try {
            const categories = await prisma.categories.findMany({
                include: {
                    Events: true,
                }
            });
            res.status(200).send(categories);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async getById(req: Request, res: Response) {
        try {
            const category = await prisma.categories.findUnique({
                where: { category_id: Number(req.params.id) },
            });
            if (!category) return res.status(404).send({ message: "Category not found" });
            res.status(200).send(category);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const category = await prisma.categories.create({
                data: { name, description },
            });
            res.status(201).send(category);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { name, description } = req.body;
            const category = await prisma.categories.update({
                where: { category_id: Number(req.params.id) },
                data: { name, description },
            });
            res.status(200).send(category);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            await prisma.categories.delete({
                where: { category_id: Number(req.params.id) },
            });
            res.status(200).send({ message: "Category deleted" });
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default CategoriesController;