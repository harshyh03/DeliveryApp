const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "DELIVERYAPP_SECUR";

app.use(express.json());

const saveOrderToDB = (processedOrder) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!processedOrder.courier)
        return reject(new Error("No courier assigned"));

      resolve({ success: true, db_id: Math.floor(Math.random() * 1000) });
    }, 300);
  });
};

const validateApiKey = (req, res, next) => {
  const key = req.headers["x-delivery-key"];

  if (!key) {
    return res
      .status(400)
      .json({ error: "Missing API key in 'x-delivery-key' header" });
  }

  if (key !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

const determineCourier = (weight) => {
  if (weight < 2000) return "Royal Mail";
  if (weight >= 2000 && weight < 10000) return "DPD";
  if (weight >= 10000) return "Freight";

  return "Unknown"; //in case weight is undefined or null or not comparable
};

app.post("/webhook/order", validateApiKey, async (req, res) => {
  try {
    const orderData = req.body;
    if (!orderData || !Array.isArray(orderData.line_items)) {
      return res.status(400).json({
        error: "Invalid payload. 'line_items' is missing.",
      });
    }

    const totalWeight = orderData.line_items.reduce(
      (sum, item) => sum + item.grams * item.quantity,
      0
    );

    const courier = determineCourier(totalWeight);

    const processedOrder = {
      id: orderData.id,
      customer_email: orderData.email,
      total_weight: totalWeight,
      courier,
      timestamp: new Date(orderData.created_at),
    };

    const dbResult = await saveOrderToDB(processedOrder);
    res.status(200).json({
      message: "Order processed successfully",
      processed_order: processedOrder,
      data: dbResult,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
