export function scrambleEmail(email, secretKey) {
    const encryptedEmail = [];
    for (let i = 0; i < email.length; i++) {
        const charCode = email.charCodeAt(i);
        const keyChar = secretKey.charCodeAt(i % secretKey.length);
        const encryptedCharCode = charCode ^ keyChar;
        encryptedEmail.push(String.fromCharCode(encryptedCharCode));
    }
    return encryptedEmail.join('');
}