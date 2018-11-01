// Developed by Houlak
export enum ConsumerType {
  workshop       = 1,
  individual     = 2,
  insurer        = 3,
  concessionaire = 4
}

export function getConsumerTypeString(c: ConsumerType) {
  switch (c) {
    case ConsumerType.workshop: {
      return 'Taller'
    }
    case ConsumerType.individual: {
      return 'Particular'
    }
    case ConsumerType.insurer: {
      return 'Aseguradora'
    }
    case ConsumerType.concessionaire: {
      return 'Concesionaria'
    }
  }
}
