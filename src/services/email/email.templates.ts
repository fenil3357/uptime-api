export const generateHtmlTemplateForEmailVerification = ({
  name,
  link
}: {
  name: string;
  link: string;
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
      body {
        font-family: 'Helvetica Neue', Arial, sans-serif;
        background-color: #f9fafb;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
      }
      .header {
        background-color: #10b981;
        color: #ffffff;
        text-align: center;
        padding: 20px;
      }
      .header h1 {
        font-size: 26px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .header h1::before {
        content: "🔔";
        margin-right: 10px;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content p {
        font-size: 16px;
        color: #4b5563;
        margin: 15px 0;
      }
      .button {
        margin-top: 25px;
      }
      .button a {
        text-decoration: none;
        padding: 12px 30px;
        background-color: #2563eb;
        color: #ffffff;
        font-size: 18px;
        border-radius: 50px;
        transition: background-color 0.3s;
      }
      .button a:hover {
        background-color: #1e40af;
      }
      .link-text {
        margin-top: 20px;
        color: #6b7280;
        font-size: 14px;
        word-break: break-all;
      }
      .footer {
        background-color: #f3f4f6;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #9ca3af;
      }
      @media only screen and (max-width: 600px) {
        .content {
          padding: 20px;
        }
        .button a {
          padding: 10px 25px;
          font-size: 16px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to uptime!</h1>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>🎉 We're excited to have you on board! Please verify your email to get started. Your link will expire in <b>1 hour</b>.</p>
        <div class="button">
          <a href="${link}" target="_blank">Verify My Email</a>
        </div>
        <p class="link-text">If the button doesn't work, copy and paste this link into your browser:</p>
        <p class="link-text"><a href="${link}" target="_blank">${link}</a></p>
      </div>
      <div class="footer">
        <p>If you didn't sign up for uptime, you can safely ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} uptime. All rights reserved. 🌐</p>
      </div>
    </div>
  </body>
  </html>
  `;
};
