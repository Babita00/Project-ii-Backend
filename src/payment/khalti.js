import axios from "axios";
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

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
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
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    throw new Error("Failed to initialize Khalti payment");
  }
};

export { verifyKhaltiPayment, initializeKhaltiPayment };
