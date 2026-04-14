/** Metadados dos guias publicados (índice em /guias). */
export interface GuiaListItem {
  slug: string;
  title: string;
  description: string;
  /** ISO YYYY-MM-DD */
  publishedAt: string;
  readTimeLabel?: string;
}

export const guias: GuiaListItem[] = [
  {
    slug: 'areia-lavada',
    title: 'Areia Lavada para Construção Civil: O Guia Completo',
    description:
      'Areia lavada é o agregado miúdo com limpeza e classificação para reduzir impurezas e dar mais previsibilidade ao traço em concreto e argamassa. O guia explica quando usar areia fina, média ou grossa, como isso impacta desempenho em obra e por que especificação técnica vem antes do preço.',
    publishedAt: '2026-04-14',
    readTimeLabel: '15 min de leitura',
  },
];
