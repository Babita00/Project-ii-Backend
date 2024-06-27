import fetch from "node-fetch";
import Payment from "./models/Payment";
import dbConnect from "./dbConnection";

/**
 * Function to verify Khalti Payment.
 * @param {string} pidx - The payment ID to verify.
 * @returns {Promise<object>} - The verification result from Khalti.
 * @throws {Error} - Throws error if the verification request fails.
 */
const verifyKhaltiPayment = async (pidx) => {
  await dbConnect();

  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const reqOptions = {
    method: "POST",
    headers: headersList,
  };

  try {
    const response = await fetch(
      `${process.env.KHALTI_URL}epayment/lookup/${pidx}/`,
      reqOptions,
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Response data:", errorData);
      throw new Error("Failed to verify Khalti payment");
    }
    const data = await response.json();

    // Save to database
    const payment = new Payment(data);
    await payment.save();

    return data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error.message);
    throw new Error("Failed to verify Khalti payment");
  }
};

/**
 * Function to initialize Khalti Payment.
 * @param {object} details - The payment details.
 * @param {number} details.amount - The payment amount in paisa.
 * @param {string} details.purchase_order_id - The ID of the purchase order.
 * @param {string} details.purchase_order_name - The name of the purchase order.
 * @param {string} details.return_url - The URL to return to after payment.
 * @param {string} details.website_url - The website URL initiating the payment.
 * @returns {Promise<object>} - The initialization result from Khalti.
 * @throws {Error} - Throws error if the initialization request fails.
 */
const initializeKhaltiPayment = async (details) => {
  await dbConnect();

  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify(details);

  const reqOptions = {
    method: "POST",
    headers: headersList,
    body: bodyContent,
  };

  try {
    const response = await fetch(
      `${process.env.KHALTI_URL}epayment/initiate/`,
      reqOptions,
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Response data:", errorData);
      throw new Error("Failed to initialize Khalti payment");
    }
    const data = await response.json();

    // Save to database
    const payment = new Payment({ ...details, pidx: data.pidx });
    await payment.save();

    return data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error.message);
    throw new Error("Failed to initialize Khalti payment");
  }
};

export { verifyKhaltiPayment, initializeKhaltiPayment };
