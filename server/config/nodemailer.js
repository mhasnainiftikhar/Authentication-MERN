import brevo from "@getbrevo/brevo";

export const sendEmail = async (toEmail, subject, textContent) => {
    try {
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );

        const emailData = {
            sender: { email: "hasnainiftikhar930@gmail.com" },
            to: [{ email: toEmail }],
            subject: subject,
            textContent: textContent,
        };

        const response = await apiInstance.sendTransacEmail(emailData);
        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Email sending error:", error);
    }
};
