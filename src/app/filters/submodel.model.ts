// Developed by Houlak
export class Submodel {
  _id: string;
  name: string;

  constructor(name) {
    this.name = name
  }
}

export interface PaginatedSubmodels {
  data: Submodel[],
  total: number
}
