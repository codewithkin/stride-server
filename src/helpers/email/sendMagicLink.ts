import nodemailer from 'nodemailer';

export async function sendMagicLink({
    email,
    token,
    url,
}: {
    email: string;
    token: string;
    url: string;
}) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: '"Stride Auth" <no-reply@stride.com>',
        to: email,
        subject: 'Your Magic Login Link',
        html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>🔐 Magic Link Login</h2>
        <p>Hello! Click the button below to log in to your Stride account.</p>
        <a href="${url}" style="
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: bold;
        ">Login Now</a>
      </div>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Magic link sent:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending magic link:', error);
        throw new Error('Failed to send verification email.');
    }
}
