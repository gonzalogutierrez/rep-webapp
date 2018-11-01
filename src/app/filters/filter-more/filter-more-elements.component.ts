// Developed by Houlak
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IPageChangeEvent } from '@covalent/core';

// services
import { FilterService } from '../filters.service';

// models
import { FilterType } from '../filter-type.enum';
import { PAGE_SIZE } from '../../common';


@Component({
  selector: 'app-filter-more',
  templateUrl: './filter-more-elements.component.html',
  styleUrls: ['./filter-more-elements.component.scss']
})
export class FilterMoreElementsDialog implements OnInit {

  elements: Element[] = [];
  title: string = ""
  filterType: FilterType
  elementsTotal: number

  brandId;
  modelId;

  fromRow = 1;
  currentPage = 1;
  pageSize = PAGE_SIZE;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<FilterMoreElementsDialog>, private filterService: FilterService) {
    this.title = data.title
    this.filterType = data.filterType
    this.brandId = data.brandId
    this.modelId = data.modelId

    this.getElements()
  }

  ngOnInit() {
  }

  filterSelected(filter) {
    this.dialogRef.close(filter)
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    console.log(this.currentPage);
    this.getElements()
  }

  getElements() {
    switch (this.filterType) {
      case FilterType.brand:
        this.filterService.getBrands(this.currentPage).subscribe(
          response => this.loadElements(response)
        );
        break
      case FilterType.category:
        this.filterService.getCategories(this.currentPage).subscribe(
          response => this.loadElements(response)
        );
        break
      case FilterType.model:
        this.filterService.getModels(this.currentPage, this.brandId).subscribe(
          response => this.loadElements(response)
        );
        break
      case FilterType.submodel:
        this.filterService.getSubmodels(this.currentPage, this.modelId).subscribe(
          response => this.loadElements(response)
        );
        break
    }
  }

  loadElements(response) {
    this.elements = response.data
    this.elementsTotal = response.total
  }
}

interface Element {
  _id: string,
  name: string
}


