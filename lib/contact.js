const PHONE_E164 = '+12402263786';
const digits = PHONE_E164.slice(2); // US 10-cifreni broj, bez +1 prefiksa

export const PHONE_DISPLAY = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
export const PHONE_TEL_HREF = `tel:${PHONE_E164}`;
export const PHONE_SMS_HREF = `sms:${PHONE_E164}`;

export const EMAIL = 'growth.corecruitinggroup@gmail.com';
export const EMAIL_HREF = `mailto:${EMAIL}`;
