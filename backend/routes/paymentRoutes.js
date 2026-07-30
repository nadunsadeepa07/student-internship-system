const express = require("express");
const router = express.Router();
const md5 = require("crypto-js/md5");
const Job = require("../models/Job");

// 🔥 CREATE PAYMENT
router.post("/create", (req, res) => {
  const { jobId, amount } = req.body;

  const merchant_id = "1235866";
  const merchant_secret = "NjM2MzEwNzA1NTM3NDQ0NTUwMTQ0MjQ3Nzc2NzEwMzE0MTI2MDY=";

  const order_id = "JOB_" + jobId + "_" + Date.now();
  const currency = "LKR";

  const hash = md5(
    merchant_id +
      order_id +
      amount +
      currency +
      md5(merchant_secret).toString().toUpperCase()
  )
    .toString()
    .toUpperCase();

  // save orderId to job
  Job.findByIdAndUpdate(jobId, { orderId: order_id }).exec();

  res.json({
    merchant_id,
    order_id,
    amount,
    currency,
    hash,
  });
});

// 🔥 PAYHERE NOTIFY URL
router.post("/notify", async (req, res) => {
  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  const merchant_secret = "NjM2MzEwNzA1NTM3NDQ0NTUwMTQ0MjQ3Nzc2NzEwMzE0MTI2MDY=";

  const local_md5 = md5(
    merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      md5(merchant_secret).toString().toUpperCase()
  )
    .toString()
    .toUpperCase();

  if (local_md5 === md5sig && status_code === "2") {
    // ✅ PAYMENT SUCCESS → ACTIVATE JOB
    await Job.findOneAndUpdate(
      { orderId: order_id },
      { status: "ACTIVE" }
    );
  }

  res.sendStatus(200);
});

module.exports = router;