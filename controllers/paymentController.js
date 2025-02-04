const axios = require('axios');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const Paymenthistory = require('../models/paymenthistoryModel');

exports.getAllHistoryPayment = catchAsync(async (req, res, next) => {
  const paymentHistory = await Paymenthistory.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'subscription_time'],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    data: paymentHistory,
  });
});

exports.getHistoryPaymentByIdUser = catchAsync(async (req, res, next) => {
  const idUser = req.query.id;
  const paymentHistory = await Paymenthistory.findAll({
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'subscription_time'],
      },
    ],
    where: {
      id_user: idUser,
    },
  });

  res.status(200).json({
    status: 'success',
    data: paymentHistory,
  });
});

exports.createToken = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  const body = req.body;
  const orderId = new Date().getTime().toString();

  const user = await User.findByPk(body.id_user);

  // Pecah name menjadi first_name dan last_name
  const name = user.name.split(' ');

  const costumerDetail = {
    first_name: name[0],
    last_name: name[1] || '',
    email: user.email,
  };
//update
  const grossAmount = body.amount;

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: grossAmount,
    },
    item_details: [
      {
        id: 'ITEM1',
        price: grossAmount,
        quantity: 1,
        name: 'Monthly Subscription',
        brand: 'Midtrans',
        category: 'Toys',
        merchant_name: 'Midtrans',
        url: 'http://toko/toko1?item=abc',
      },
    ],
    credit_card: {
      secure: true,
    },
    customer_details: costumerDetail,
  };

  const response = await axios.post(
    `${process.env.MIDTRANS_API_URL}/snap/v1/transactions`,
    parameter,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(
          process.env.MIDTRANS_SERVER_KEY || ''
        ).toString('base64')}`,
      },
    }
  );

  // Create payment history
  const cekOrderUserId = await Paymenthistory.findOne({
    where: {
      id_user: body.id_user,
      order_id: orderId,
    },
  });

  if (cekOrderUserId) {
    // Update Payment History
    cekOrderUserId.update({
      gross_amount: grossAmount,
      transaction_time: new Date(),
      transaction_status: 'pending',
    });

    return res.status(400).json({
      status: 'error',
      message: 'Order ID sudah diupdate',
    });
  }

  await Paymenthistory.create({
    id_user: body.id_user,
    order_id: orderId,
    gross_amount: grossAmount,
    transaction_time: new Date(),
    transaction_status: 'pending',
  });

  res.status(200).json({
    status: 'success',
    data: response.data,
  });
});

exports.webhook = catchAsync(async (req, res, next) => {
  const notification = req.body;
  console.log('Notif webhook: ', notification);

  if (
    (notification.transaction_status === 'capture' ||
      notification.transaction_status === 'settlement') &&
    notification.fraud_status === 'accept'
  ) {
    // Do your business logic here
    console.log('Transaction Success: ', req.body);

    // Update Payment History
    const paymentHistory = await Paymenthistory.findOne({
      where: {
        order_id: notification.order_id,
      },
    });

    if (paymentHistory) {
      paymentHistory.update({
        transaction_status: notification.transaction_status,
        fraud_status: notification.fraud_status,
        payment_type: notification.payment_type,
      });
    }

    // Update User Status
    const user = await User.findByPk(paymentHistory.id_user);

    // Generate bulan depan
    const date = new Date();
    date.setMonth(date.getMonth() + 1);

    if (user) {
      user.update({
        subscription_time: date,
      });
    }
  }

  res.status(200).json({ status: 'Notification received' });
});
