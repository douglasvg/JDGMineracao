export type LocalidadeTipo = 'deposito' | 'extracao';

export type LocalidadePonto = {
  nome: string;
  tipo: LocalidadeTipo;
  cidade: string;
  telefone: string;
  horario: string;
  maps: string;
  lat: number;
  lng: number;
  zoom?: number;
  endereco?: string;
  bairro?: string;
  cep?: string;
};

/** Fonte única para a página e para a API de rotas (índice = ordem padrão dos cards). */
export const localidadesPontos: LocalidadePonto[] = [
  {
    nome: 'Escritório e Depósito de União da Vitória',
    tipo: 'deposito',
    endereco: 'BR 153, s/n, Sala 01',
    bairro: 'Bairro São Gabriel',
    cidade: 'União da Vitória – PR',
    cep: 'CEP 84.602-450',
    telefone: '(42) 98815-8515',
    horario: 'Seg–Sex, 07:00 às 22:00',
    maps: 'https://maps.app.goo.gl/WjSmHKeNFWyzLp756',
    lat: -26.218424,
    lng: -51.131875,
  },
  {
    nome: 'Depósito de São Mateus do Sul',
    tipo: 'deposito',
    endereco: 'Rod. do Xisto, 590',
    bairro: 'Fluviópolis',
    cidade: 'São Mateus do Sul – PR',
    cep: 'CEP 83900-000',
    telefone: '(42) 98815-8515',
    horario: 'Seg–Sex, 07:00 às 22:00',
    maps: 'https://www.google.com/maps?q=-25.997264862060547,-50.58631896972656&z=17&hl=en',
    lat: -25.997264862060547,
    lng: -50.58631896972656,
    zoom: 17,
  },
  {
    nome: 'Extração de São Mateus do Sul',
    tipo: 'extracao',
    cidade: 'São Mateus do Sul – PR',
    telefone: '(42) 98815-8515',
    horario: 'Seg–Sex, 09:00 às 17:00',
    maps: 'https://maps.app.goo.gl/sRX7oNkj8cQmcXtU6',
    lat: -26.029093,
    lng: -50.521694,
  },
];
