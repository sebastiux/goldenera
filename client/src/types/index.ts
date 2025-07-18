export interface Program {
  id: string;
  name: string;
  price: number;
  features: string[];
  description?: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}
