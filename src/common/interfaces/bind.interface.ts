export interface BindRequestInterface {
  to?: {
    cbu: string;
  };
  value?: {
    currency: string;
    amount: string;
  };
  concept?: string;
  description?: string
  origin_id?: string;
  origin_debit?: {
    cvu: string;
  };
}
