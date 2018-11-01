// Developed by Houlak
export enum OfferAvailable {
    now = 1,
    oneHour = 2,
    twoHours = 3,
    fourHours = 4,
    twentyFourHours = 5,
    fortyEightHours = 6
  }

  export function getOfferAvailableString(paymentMethod: OfferAvailable) {
    switch (+paymentMethod) {
      case OfferAvailable.now:
        return 'Disponible ya';
      case OfferAvailable.oneHour:
        return 'Disponible en 1 hora';
      case OfferAvailable.twoHours:
        return 'Disponible en 2 horas';
      case OfferAvailable.fourHours:
        return 'Disponible en 4 horas';
      case OfferAvailable.twentyFourHours:
        return 'Disponible en 24 horas';
      case OfferAvailable.fortyEightHours:
        return 'Disponible en 48 horas';
    }
  }
