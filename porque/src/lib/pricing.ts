export const PLANS = {
  anual: { nome: 'anual', cents: 6990, trial: '7 dias grátis' },
  mensal: { nome: 'mensal', cents: 990, trial: 'sem período de teste' },
} as const;

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function formatBRL(cents: number): string {
  // Intl separates the symbol with a no-break space; the site writes a plain one.
  return brl.format(cents / 100).replace(/\s/g, ' ');
}

export function perMonthCents(yearlyCents: number): number {
  return Math.round(yearlyCents / 12);
}

export function yearlyDiscountPercent(yearlyCents: number, monthlyCents: number): number {
  return Math.round((1 - yearlyCents / (monthlyCents * 12)) * 100);
}
