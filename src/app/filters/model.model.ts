// Developed by Houlak
export class Model {
  _id: string;
  name: string;
  year: string;
  pictureURL: string;

  constructor(name, year, pictureURL) {
    this.name = name
    this.year = year
    this.pictureURL = pictureURL
  }
}
export interface PaginatedModels {
  data: Model[],
  total: number
}
