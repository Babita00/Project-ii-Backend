import fetch from "node-fetch";

/**
 * Function to verify Khalti Payment.
 * @param {string} pidx - The payment ID to verify.
 * @returns {Promise<object>} - The verification result from Khalti.
 * @throws {Error} - Throws error if the verification request fails.
 */
const verifyKhaltiPayment = async (pidx) => {
  const headersList = {
    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({
    return_url: "https://example.com/payment/",
    website_url: "https://example.com/",
    amount: 1300,
    purchase_order_id: "test12",
    purchase_order_name: "test",
    customer_info: {
      name: "Khalti Bahadur",
      email: "example@gmail.com",
      phone: "9800000123",
    },
    amount_breakdown: [
      {
        label: "Mark Price",
        amount: 1000,
      },
      {
        label: "VAT",
        amount: 300,
      },
    ],
    product_details: [
      {
        identity: "1234567890",
        name: "Khalti logo",
        total_price: 1300,
        quantity: 1,
        unit_price: 1300,
      },
    ],
    merchant_username: "merchant_name",
    merchant_extra: "merchant_extra",
  });

  const reqOptions = {
    method: "POST",
    headers: headersList,
    body: bodyContent,
  };

  try {
    const response = await fetch(
      `${process.env.KHALTI_URL}epayment/lookup/`,
      reqOptions,
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Response data:", errorData);
      throw new Error("Failed to verify Khalti payment");
    }
    const data = await response.json();
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
    return data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error.message);
    throw new Error("Failed to initialize Khalti payment");
  }
};

export { verifyKhaltiPayment, initializeKhaltiPayment };
