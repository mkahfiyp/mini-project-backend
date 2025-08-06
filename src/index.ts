import App from "./app";
import cron from "node-cron";
import cancelExpiredTransactions from "./jobs/cancelExpiredTransactions";

const main = () => {
    const server = new App();
    server.start();
};

main();

cron.schedule("* * * * *", async () => {
    await cancelExpiredTransactions.cancelExpiredTransactions();
    console.log("Expired transactions checked and cancelled if needed.");
})