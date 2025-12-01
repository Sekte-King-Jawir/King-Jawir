import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

// Kirim email verifikasi
export async function sendVerificationEmail(email: string, url: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Verifikasi Email - Marketplace',
    html: `
      <h2>Verifikasi Email Anda</h2>
      <p>Klik tombol di bawah untuk verifikasi:</p>
      <a href="${url}" style="background:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Verifikasi Email
      </a>
      <p>Link berlaku 24 jam.</p>
    `
  })
}

// Kirim email reset password
export async function sendResetPasswordEmail(email: string, url: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset Password - Marketplace',
    html: `
      <h2>Reset Password</h2>
      <p>Klik tombol di bawah untuk reset password:</p>
      <a href="${url}" style="background:#dc3545;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
        Reset Password
      </a>
      <p>Link berlaku 1 jam.</p>
    `
  })
}