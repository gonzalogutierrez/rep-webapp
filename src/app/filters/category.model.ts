// Developed by Houlak
export class Category {
  _id: string;
  name: string;

  constructor(name) {
    this.name = name
  }
}

export interface PaginatedCategories {
  data: Category[],
  total: number
}
