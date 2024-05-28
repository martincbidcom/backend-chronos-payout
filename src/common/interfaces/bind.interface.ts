export interface BindRequestDto {
  to?: {
    cbu: string;
  };
  value?: {
    currency: string;
    amount: string;
  };
  concept?: string;
  origin_id?: string;
  origin_debit?: {
    cvu: string;
  };
}
