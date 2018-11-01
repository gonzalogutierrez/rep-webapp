// Developed by Houlak
export default interface ISale {
  _id:	any
  offer: any
  request: any
  status: SaleStatus,
  code: string,
  consumer: any
}


export enum SaleStatus {
  pending   = 1,
  finished  = 2,
  billed    = 3
}

export function getSaleStatusString(status: SaleStatus) {
  switch (+status) {
    case SaleStatus.pending:
      return 'Pendiente';
    case SaleStatus.finished:
      return 'Finalizada';
    case SaleStatus.billed:
      return 'Facturada';
  }
}

export interface PaginatedSales {
  sales: ISale[],
  total: number
}

export enum SaleType {
  offer = 1,
  accepted = 2,
  finished = 3
}

export function getSaleTypeString(type: SaleType) {
  switch (+type) {
    case SaleType.offer:
      return 'Cotizadas';
    case SaleType.accepted:
      return 'Aceptadas para retirar';
    case SaleType.finished:
      return 'Vendidas';
  }
}
