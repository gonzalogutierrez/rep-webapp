// Developed by Houlak

export class Request {

  _id: string;
  brandId: string;
  brand: string;
  modelId: string;
  mmodel: string;
  submodelId: string;
  submodel: string;
  year: number;
  categoryId: string;
  descr: string;
  oem: string;
  vin: string;
  pictureURLList: [PictureURLList];

  consumer: {
    _id: string,
    consumerFirstname: string,
    consumerLastname: string,
    consumerType: number
  }

  constructor() {};
}

export interface PaginatedRequests {
  requests: Request[],
  total: number
}

interface PictureURLList {
  thumbnailUrl: string,
  url: string
}
