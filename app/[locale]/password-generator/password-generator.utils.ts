import { PasswordOptions, PasswordResult } from './password-generator.types';

const UPPERCASE: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE: string = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS: string = '0123456789';
const SYMBOLS: string = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS: string = 'il1Lo0O';

export function generatePassword(options: PasswordOptions): PasswordResult {
  let charset: string = '';
  if (options.uppercase) charset += UPPERCASE;
  if (options.lowercase) charset += LOWERCASE;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;

  if (options.excludeSimilar) {
    const similarRegex: RegExp = new RegExp(`[${SIMILAR_CHARS}]`, 'g');
    charset = charset.replace(similarRegex, '');
  }

  if (charset.length === 0) {
    return {
      password: '',
      strength: 'weak',
      entropy: 0,
    };
  }

  let password: string = '';
  const array: Uint32Array = new Uint32Array(options.length);
  window.crypto.getRandomValues(array);

  for (let i: number = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  const entropy: number = Math.log2(charset.length) * options.length;
  const strength: PasswordResult['strength'] = calculateStrength(entropy);

  return {
    password,
    strength,
    entropy,
  };
}

function calculateStrength(entropy: number): PasswordResult['strength'] {
  if (entropy < 40) return 'weak';
  if (entropy < 60) return 'fair';
  if (entropy < 80) return 'good';
  if (entropy < 100) return 'strong';
  return 'very-strong';
}
