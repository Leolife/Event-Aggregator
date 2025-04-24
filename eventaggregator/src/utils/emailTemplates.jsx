import { collection, addDoc } from "firebase/firestore";
import { firestore, auth } from "../../src/firebase"; // Adjust path as needed

// Generate styled HTML email template
export const generateEmailTemplate = ({ subject, body, email }) => `
  <div style="background-color:#f2f4f6;padding:24px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background-color:#2d89ef;padding:24px 16px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:26px;font-family:'Segoe UI',Roboto,sans-serif;">🎉 Event Aggregator</h1>
        <p style="margin:6px 0 0;color:#cde4ff;font-size:14px;">Notification Center</p>
      </div>

      <!-- Main Content -->
      <div style="padding:32px 24px;font-family:'Segoe UI',Roboto,sans-serif;color:#333;">
        <h2 style="font-size:20px;margin-bottom:12px;color:#2d89ef;">${subject}</h2>
        <p style="font-size:16px;line-height:1.6;color:#444;">${body}</p>
      </div>

      <!-- Footer -->
      <div style="padding:20px;text-align:center;font-size:12px;color:#999999;font-family:'Segoe UI',Roboto,sans-serif;background-color:#fafafa;">
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:16px 0;" />
        <p style="margin:0;">This email was sent to <strong>${email}</strong></p>
        <p style="margin:4px 0 0;">If this wasn’t you, please <a href="#" style="color:#2d89ef;text-decoration:none;">contact support</a>.</p>
        <p style="margin-top:10px;">&copy; ${new Date().getFullYear()} Event Aggregator</p>
      </div>
    </div>
  </div>
`;

// Sends the notification preferences summary email
const sendNotificationPreferencesEmail = async (settings) => {
  const email = auth.currentUser?.email;
  const name = auth.currentUser?.displayName || "User";

  let subject = "Your Notification Preferences Were Updated";
  let customPrefs = "";

  if (settings.subscriptionStatus === "Custom") {
    const selected = Object.entries(settings.customOptions)
      .filter(([, v]) => v)
      .map(([k]) => `• ${k.replace(/([A-Z])/g, " $1")}`)
      .join("<br />");
    customPrefs = selected || "You did not enable any custom options.";
  }

  const bodyContent = `
    <p>Hi ${name},</p>
    <p>You just updated your notification preferences on Event Aggregator.</p>
    <p><strong>Status:</strong> ${settings.subscriptionStatus}</p>
    ${
      settings.subscriptionStatus === "Custom"
        ? `<p><strong>Selected Options:</strong><br />${customPrefs}</p>`
        : ""
    }
    <p>If this wasn't you, please review your account settings.</p>
  `;

  try {
    await addDoc(collection(firestore, "mail"), {
      to: email,
      message: {
        subject,
        text: `Hi ${name},\n\nYour notification preferences were updated to "${settings.subscriptionStatus}".`,
        html: generateEmailTemplate({ subject, body: bodyContent, email }),
      },
    });
  } catch (err) {
    console.error("Failed to send preferences email:", err);
  }
};

export default sendNotificationPreferencesEmail;
