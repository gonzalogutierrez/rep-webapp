// Developed by Houlak
export enum OfferType {
  original = 1,
  generic = 2,
  genuine = 3
}

export function getOfferTypeString(type: OfferType) {
  switch (+type) {
    case OfferType.original:
      return "Original";
    case OfferType.generic:
      return "Genérico";
    case OfferType.genuine:
      return "Genuino";
  }
}
