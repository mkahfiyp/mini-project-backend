import { prisma } from "../config/prisma";

class TransactionJob {
    public async cancelExpiredTransactions() {
        const expiredTransactions = await prisma.transactions.findMany({
            where: {
                status: "waiting_payment",
                payment_proof: null,
                payment_deadline: { lt: new Date() }
            },
            include: {
                TransactionTickets: true
            }
        });

        for (const val of expiredTransactions) {
            await prisma.transactions.update({
                where: { transaction_id: val.transaction_id },
                data: { status: "canceled" }
            });

            for (const tranTicket of val.TransactionTickets) {
                await prisma.tickets.update({
                    where: { ticket_id: tranTicket.ticket_id },
                    data: { kuota: { increment: tranTicket.quantity } }
                });
            }

            if (val.used_point > 0) {
                await prisma.users.update({
                    where: { user_id: val.user_id },
                    data: { points: { increment: val.used_point } }
                });
            }
        }
    }
}

export default new TransactionJob();