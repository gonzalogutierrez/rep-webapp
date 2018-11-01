// Developed by Houlak
export enum OfferStatus {
  active = 1,
  assigned = 2,
  rejected = 3,
}

export function getOfferStatusString(status: OfferStatus) {
  switch (+status) {
    case OfferStatus.active:
      return 'Activo';
    case OfferStatus.assigned:
      return 'Asignado';
    case OfferStatus.rejected:
      return 'Rechazado';
  }
}
