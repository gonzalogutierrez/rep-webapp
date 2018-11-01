// Developed by Houlak
export enum OfferPaymentMethod {
  contadoEfectivo = 1,
  cheque = 2,
  cuentaCorriente = 3,
  tarjetaDeCrédito = 4,
  tarjetaDeDébito = 5,
  transferenciaBancaria = 6,
  abitab = 7,
  redPagos = 8
}

export function getOfferPaymentMethodString(paymentMethod: OfferPaymentMethod) {
  switch (+paymentMethod) {
    case OfferPaymentMethod.contadoEfectivo:
      return "Contado efectivo";
    case OfferPaymentMethod.cheque:
      return "Cheque";
    case OfferPaymentMethod.cuentaCorriente:
      return "Cuenta corriente";
    case OfferPaymentMethod.tarjetaDeCrédito:
      return "Tarjeta de crédito";
    case OfferPaymentMethod.tarjetaDeDébito:
      return "Tarjeta de débito";
    case OfferPaymentMethod.transferenciaBancaria:
      return "Transferencia bancaria";
    case OfferPaymentMethod.abitab:
      return "Abitab";
    case OfferPaymentMethod.redPagos:
      return "Red Pagos";
  }
}
