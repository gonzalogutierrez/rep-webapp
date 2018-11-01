// Developed by Houlak

export class Offer {
  _id: string;
  request: {
    _id: string,
    descr: string,
    name: string,
    pictureURLList: PictureURLList[]
  };
  price: number;
  brand: string;
  coo: string;
  condition: number;
  type: number;
  devolution: boolean;
  availableNow: number;
  paymentMethods: [string];
  delivery: number;
  status: number;
  selected: boolean;
  calification: number;

  constructor(requestId: string, price, brand, coo, condition, type, devolution, availableNow, paymentMethods, delivery, pictureURLList) {
    this.request = {
      _id: requestId,
      descr: "",
      name: "",
      pictureURLList: []
    };
    this.price = price;
    this.brand = brand;
    this.coo = coo;
    this.condition = condition;
    this.type = type;
    this.devolution = devolution;
    this.availableNow = availableNow;
    this.paymentMethods = paymentMethods;
    this.delivery = delivery;
  }
}

export interface PaginatedOffers {
  offers: Offer[],
  total: number
}

interface PictureURLList {
  thumbnailUrl: string,
  url: string
}
