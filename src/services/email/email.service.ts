import nodemailer from 'nodemailer'

export type send_email_input = {
  from: string,
  to: string | string[],
  subject: string,
  html: string,
  attachments?: {
    filename: string,
    content: any
  }[] | undefined,
  bcc?: string
}

export const sendEmailService = async (options: send_email_input) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'citynect.in',
      port: 465,
      auth: {
        user: 'info@citynect.in',
        pass: ']mO=1w92gTJm',
      },
    });

    await transporter.sendMail(options);
    return 'Email sent successfully.'
  } catch (error: any) {
    console.log("🚀 ~ sendEmailService ~ error:", error)
    // throw new Error(error?.message || 'Something went wrong while sending email');
  }
}