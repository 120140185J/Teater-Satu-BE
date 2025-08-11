const cron = require('node-cron');
const Paymenthistory = require('../models/paymenthistoryModel');
const User = require('../models/userModel');

const runCronJob = async () => {
  try {
    const now = Date.now();
    const pendingPayments = await Paymenthistory.findAll({
      where: { transaction_status: 'pending' },
    });

    const updatePromises = pendingPayments
      .filter((payment) => {
        if (!payment.transaction_time) return false;
        const transactionTime = new Date(payment.transaction_time).getTime();
        return now - transactionTime > 5 * 60 * 1000; // 5 menit * 60 detik * 1000 milidetik
      })
      .map((payment) =>
        Promise.all([
          payment.update({ transaction_status: 'Terminated' }),
          User.update(
            { subscription_time: null },
            { where: { id: payment.id_user } }
          ),
        ])
      );

    await Promise.all(updatePromises);
  } catch (error) {
    // Silent error handling to prevent logging
  }
};

const startCronJobs = () => {
  cron.schedule('0 * * * *', runCronJob);
};

module.exports = { startCronJobs };
