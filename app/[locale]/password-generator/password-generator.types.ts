export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean; // e.g. i, l, 1, L, o, 0, O
}

export interface PasswordResult {
  password: string;
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  entropy: number;
}
