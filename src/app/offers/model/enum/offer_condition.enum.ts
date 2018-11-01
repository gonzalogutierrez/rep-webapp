// Developed by Houlak
export enum OfferCondition {
  used = 1,
  new = 2,
  rebuilt = 3
}

export function getOfferConditionString(condition: OfferCondition) {
  switch (+condition) {
    case OfferCondition.used:
      return "Usado";
    case OfferCondition.new:
      return "Nuevo";
    case OfferCondition.rebuilt:
      return "Reconstruído";
  }
}
