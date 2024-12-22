// PayPal API endpoint for payouts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(supabaseUrl, supabaseKey);
const url = "https://api-m.sandbox.paypal.com/v1/payments/payouts";

// Function to settle payment via PayPal
export default async function settlePayment(amount, recipientEmail) {
  // Get PayPal API credentials from environment variables
  //
  const supabaseKey =

  if (!clientId || !secret) {
    throw new Error(
      "Missing PayPal Client ID or Secret in environment variables.",
    );
  }

  // Encode credentials for Basic Authentication
  const encodedCredentials = btoa(`${clientId}:${secret}`);
  const authorizationHeader = `Basic ${encodedCredentials}`;

  // Generate a unique sender batch ID using timestamp
  const currentTimestamp = new Date().toISOString();
  const senderBatchId = "Payouts_" + currentTimestamp;

  // Construct the payout payload
  const payload = {
    sender_batch_header: {
      sender_batch_id: senderBatchId,
      email_subject: "You have a payout!",
      email_message:
        "You have received a payout! Thanks for using our service!",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: {
          value: amount,
          currency: "SGD", // Update currency if needed
        },
        note: "Thanks for your patronage!",
        sender_item_id: "201403140001",
        receiver: recipientEmail,
        notification_language: "en-US",
      },
    ],
  };

  function generateTransactionId(recipientEmail) {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomStr = Math.random().toString(36).substring(2, 8); // Random alphanumeric string
    return `txn_${timestamp}_${randomStr}_${recipientEmail}`;
  }

  // Define the headers
  const headers = {
    "Content-Type": "application/json",
    Authorization: authorizationHeader,
  };

  try {
    // Make the API request to PayPal
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    // Handle the response
    if (response.ok) {
      const responseData = await response.json();
      console.log("Payout successful:", responseData);
      const { error } = await supabase.from("transactions").insert({
        unique_id: generateTransactionId(recipientEmail),
        to_email: recipientEmail,
        txn_amount: amount,
        date_time: currentTimestamp,
      });
      if (error) {
        console.error("Error inserting into Supabase:", error);
      } else {
        console.log("Transaction inserted successfully into Supabase.");
      }
    } else {
      const errorData = await response.json();
      console.log(`Error: ${response.status} - ${errorData}`);
    }
  } catch (error) {
    console.error("Error making the payout request:", error);
  }
}
