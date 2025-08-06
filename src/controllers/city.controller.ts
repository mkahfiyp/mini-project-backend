import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class CityController {
    public async getAll(req: Request, res: Response) {
        try {
            const cities = await prisma.cities.findMany();
            res.status(200).send(cities);
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

export default CityController;