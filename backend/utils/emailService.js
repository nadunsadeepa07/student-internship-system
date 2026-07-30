const nodemailer = require("nodemailer");

// =======================================
// TRANSPORTER CREATE
// =======================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// =======================================
// APPROVAL EMAIL - STUDENT
// =======================================
const sendStudentApprovalEmail = async (email, username) => {
  const mailOptions = {
    from: `"Internship Management System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✅ Your Account Has Been Approved!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f4f6f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(0,0,0,0.10);
            }
            .header {
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 26px;
              letter-spacing: 1px;
            }
            .header p {
              color: #e0e7ff;
              margin: 8px 0 0;
              font-size: 15px;
            }
            .body {
              padding: 36px 36px 24px;
            }
            .greeting {
              font-size: 18px;
              color: #1e293b;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .message {
              font-size: 15px;
              color: #475569;
              line-height: 1.7;
              margin-bottom: 28px;
            }
            .status-badge {
              display: inline-block;
              background: #D1FAE5;
              color: #065F46;
              border-radius: 50px;
              padding: 8px 24px;
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 28px;
              letter-spacing: 0.5px;
            }
            .btn {
              display: block;
              width: fit-content;
              margin: 0 auto 28px;
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 38px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .divider {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 24px 0;
            }
            .footer {
              text-align: center;
              padding: 18px 36px 28px;
              color: #94a3b8;
              font-size: 13px;
            }
            .icon {
              font-size: 52px;
              display: block;
              text-align: center;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Internship Management System</h1>
              <p>Student Account Notification</p>
            </div>
            <div class="body">
              <span class="icon">✅</span>
              <div class="greeting">Hello, ${username}!</div>
              <p class="message">
                Great news! Your student account registration has been 
                <strong>reviewed and approved</strong> by our admin team.<br/><br/>
                You can now log in to the platform and start exploring 
                internship opportunities that match your interests and skills.
              </p>
              <div style="text-align:center;">
                <span class="status-badge">✅ Account Approved</span>
              </div>
              <a class="btn" href="${process.env.CLIENT_URL}/login">
                Login to Your Account
              </a>
              <hr class="divider"/>
              <p class="message" style="font-size:13px; color:#94a3b8;">
                If you have any questions, please contact our support team.
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Internship Management System. 
              All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// =======================================
// REJECTION EMAIL - STUDENT
// =======================================
const sendStudentRejectionEmail = async (email, username, reason) => {
  const mailOptions = {
    from: `"Internship Management System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "❌ Your Account Registration Status",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f4f6f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(0,0,0,0.10);
            }
            .header {
              background: linear-gradient(135deg, #EF4444, #DC2626);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 26px;
              letter-spacing: 1px;
            }
            .header p {
              color: #fee2e2;
              margin: 8px 0 0;
              font-size: 15px;
            }
            .body {
              padding: 36px 36px 24px;
            }
            .greeting {
              font-size: 18px;
              color: #1e293b;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .message {
              font-size: 15px;
              color: #475569;
              line-height: 1.7;
              margin-bottom: 24px;
            }
            .status-badge {
              display: inline-block;
              background: #FEE2E2;
              color: #991B1B;
              border-radius: 50px;
              padding: 8px 24px;
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 24px;
              letter-spacing: 0.5px;
            }
            .reason-box {
              background: #FEF2F2;
              border-left: 4px solid #EF4444;
              border-radius: 8px;
              padding: 16px 20px;
              margin-bottom: 28px;
              color: #7f1d1d;
              font-size: 14px;
              line-height: 1.6;
            }
            .reason-box strong {
              display: block;
              margin-bottom: 6px;
              font-size: 15px;
              color: #991B1B;
            }
            .btn {
              display: block;
              width: fit-content;
              margin: 0 auto 28px;
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 38px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .divider {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 24px 0;
            }
            .footer {
              text-align: center;
              padding: 18px 36px 28px;
              color: #94a3b8;
              font-size: 13px;
            }
            .icon {
              font-size: 52px;
              display: block;
              text-align: center;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Internship Management System</h1>
              <p>Student Account Notification</p>
            </div>
            <div class="body">
              <span class="icon">❌</span>
              <div class="greeting">Hello, ${username}!</div>
              <p class="message">
                We regret to inform you that your student account registration 
                has been <strong>reviewed and rejected</strong> by our admin team.
              </p>
              <div style="text-align:center;">
                <span class="status-badge">❌ Account Rejected</span>
              </div>
              <div class="reason-box">
                <strong>📋 Reason for Rejection:</strong>
                ${reason || "Your registration details could not be verified. Please contact support for more information."}
              </div>
              <p class="message">
                If you believe this is a mistake or would like to re-register 
                with corrected information, please contact our support team 
                or try registering again.
              </p>
              <a class="btn" href="${process.env.CLIENT_URL}/login">
                Try Again
              </a>
              <hr class="divider"/>
              <p class="message" style="font-size:13px; color:#94a3b8;">
                If you have any questions, please contact our support team.
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Internship Management System. 
              All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// =======================================
// APPROVAL EMAIL - COMPANY
// =======================================
const sendCompanyApprovalEmail = async (email, username) => {
  const mailOptions = {
    from: `"Internship Management System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "✅ Your Company Account Has Been Approved!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f4f6f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(0,0,0,0.10);
            }
            .header {
              background: linear-gradient(135deg, #0EA5E9, #0284C7);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 26px;
              letter-spacing: 1px;
            }
            .header p {
              color: #bae6fd;
              margin: 8px 0 0;
              font-size: 15px;
            }
            .body {
              padding: 36px 36px 24px;
            }
            .greeting {
              font-size: 18px;
              color: #1e293b;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .message {
              font-size: 15px;
              color: #475569;
              line-height: 1.7;
              margin-bottom: 28px;
            }
            .status-badge {
              display: inline-block;
              background: #D1FAE5;
              color: #065F46;
              border-radius: 50px;
              padding: 8px 24px;
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 28px;
            }
            .features {
              background: #F0F9FF;
              border-radius: 10px;
              padding: 18px 22px;
              margin-bottom: 28px;
            }
            .features p {
              margin: 0 0 8px;
              color: #0369a1;
              font-size: 14px;
            }
            .features ul {
              margin: 0;
              padding-left: 20px;
              color: #0284c7;
              font-size: 14px;
              line-height: 1.8;
            }
            .btn {
              display: block;
              width: fit-content;
              margin: 0 auto 28px;
              background: linear-gradient(135deg, #0EA5E9, #0284C7);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 38px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: 600;
            }
            .divider {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 24px 0;
            }
            .footer {
              text-align: center;
              padding: 18px 36px 28px;
              color: #94a3b8;
              font-size: 13px;
            }
            .icon {
              font-size: 52px;
              display: block;
              text-align: center;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏢 Internship Management System</h1>
              <p>Company Account Notification</p>
            </div>
            <div class="body">
              <span class="icon">✅</span>
              <div class="greeting">Hello, ${username}!</div>
              <p class="message">
                Congratulations! Your company account has been 
                <strong>reviewed and approved</strong> by our admin team.<br/><br/>
                You can now log in and start posting internship opportunities 
                to connect with talented students.
              </p>
              <div style="text-align:center;">
                <span class="status-badge">✅ Company Account Approved</span>
              </div>
              <div class="features">
                <p><strong>🚀 What you can do now:</strong></p>
                <ul>
                  <li>Post internship job opportunities</li>
                  <li>Review student applications</li>
                  <li>Manage your company profile</li>
                  <li>Connect with talented students</li>
                </ul>
              </div>
              <a class="btn" href="${process.env.CLIENT_URL}/login">
                Login to Company Dashboard
              </a>
              <hr class="divider"/>
              <p class="message" style="font-size:13px; color:#94a3b8;">
                If you have any questions, please contact our support team.
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Internship Management System. 
              All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// =======================================
// REJECTION EMAIL - COMPANY
// =======================================
const sendCompanyRejectionEmail = async (email, username, reason) => {
  const mailOptions = {
    from: `"Internship Management System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "❌ Your Company Account Registration Status",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: 'Segoe UI', Arial, sans-serif;
              background: #f4f6f9;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 24px rgba(0,0,0,0.10);
            }
            .header {
              background: linear-gradient(135deg, #EF4444, #DC2626);
              padding: 40px 30px;
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 26px;
              letter-spacing: 1px;
            }
            .header p {
              color: #fee2e2;
              margin: 8px 0 0;
              font-size: 15px;
            }
            .body {
              padding: 36px 36px 24px;
            }
            .greeting {
              font-size: 18px;
              color: #1e293b;
              font-weight: 600;
              margin-bottom: 12px;
            }
            .message {
              font-size: 15px;
              color: #475569;
              line-height: 1.7;
              margin-bottom: 24px;
            }
            .status-badge {
              display: inline-block;
              background: #FEE2E2;
              color: #991B1B;
              border-radius: 50px;
              padding: 8px 24px;
              font-size: 15px;
              font-weight: 700;
              margin-bottom: 24px;
            }
            .reason-box {
              background: #FEF2F2;
              border-left: 4px solid #EF4444;
              border-radius: 8px;
              padding: 16px 20px;
              margin-bottom: 28px;
              color: #7f1d1d;
              font-size: 14px;
              line-height: 1.6;
            }
            .reason-box strong {
              display: block;
              margin-bottom: 6px;
              font-size: 15px;
              color: #991B1B;
            }
            .btn {
              display: block;
              width: fit-content;
              margin: 0 auto 28px;
              background: linear-gradient(135deg, #6366F1, #8B5CF6);
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 38px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: 600;
            }
            .divider {
              border: none;
              border-top: 1px solid #e2e8f0;
              margin: 24px 0;
            }
            .footer {
              text-align: center;
              padding: 18px 36px 28px;
              color: #94a3b8;
              font-size: 13px;
            }
            .icon {
              font-size: 52px;
              display: block;
              text-align: center;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏢 Internship Management System</h1>
              <p>Company Account Notification</p>
            </div>
            <div class="body">
              <span class="icon">❌</span>
              <div class="greeting">Hello, ${username}!</div>
              <p class="message">
                We regret to inform you that your company account registration 
                has been <strong>reviewed and rejected</strong> by our admin team.
              </p>
              <div style="text-align:center;">
                <span class="status-badge">❌ Registration Rejected</span>
              </div>
              <div class="reason-box">
                <strong>📋 Reason for Rejection:</strong>
                ${reason || "Your company registration details could not be verified. Please contact support for more information."}
              </div>
              <p class="message">
                If you believe this is a mistake or would like to re-register 
                with corrected information, please contact our support team.
              </p>
              <a class="btn" href="${process.env.CLIENT_URL}/login">
                Try Again
              </a>
              <hr class="divider"/>
              <p class="message" style="font-size:13px; color:#94a3b8;">
                If you have any questions, please contact our support team.
              </p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Internship Management System. 
              All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendStudentApprovalEmail,
  sendStudentRejectionEmail,
  sendCompanyApprovalEmail,
  sendCompanyRejectionEmail,
};