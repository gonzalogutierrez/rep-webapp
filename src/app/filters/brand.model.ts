// Developed by Houlak
export class Brand {
  _id: string;
  name: string;
  pictureURL: string;

  constructor(name, pictureURL) {
    this.name = name;
    this.pictureURL = pictureURL;
  }
}

export interface PaginatedBrands {
  data: Brand[],
  total: number
}
