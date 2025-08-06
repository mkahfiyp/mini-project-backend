import { Request, Response } from "express";
import { cloudinaryUpload } from "../config/cloudinary";
import { prisma } from "../config/prisma";

class PaymentsController {
    public async postPayment(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.send({ message: "gagal kirim" })
            }

            const upload = await cloudinaryUpload(req.file);

            const update = await prisma.transactions.update({
                where: {
                    transaction_code: req.params.id,
                }, data: {
                    payment_proof: upload.secure_url,
                    status: "done"
                }
            })

            res.status(200).send({ success: true, message: "Payment proof uploaded" })
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

export default PaymentsController;