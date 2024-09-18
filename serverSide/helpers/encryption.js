import crypto from 'crypto';

// Secret key and initialization vector (IV)
const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.encryptionSecretKey,'hex')  // Store securely in environment variables
// Encryption function
const iv = Buffer.alloc(16, 0); //

// Encrypt function
export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted; // Return the encrypted message
};

// Decrypt function
export const decrypt = (encryptedText) => {
    try {
      // Check if the message is encrypted (you can customize this check)
      const isEncrypted = /^[0-9a-fA-F]+$/.test(encryptedText); // Check if the string is a valid hex string
  
      // If not encrypted, return the plain text message
      if (!isEncrypted) {
        return encryptedText;
      }
  
      // Proceed with decryption if it's encrypted
      const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
      decrypted += decipher.final('utf-8');
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error.message);
      throw new Error('Decryption failed');
    }
  };
  
