// Developed by Houlak
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TdLoadingService } from '@covalent/core';
// services
import { RequestService } from './request.service';
import { FilterService } from '../filters/filters.service';

// components
import { FilterMoreElementsDialog } from '../filters/filter-more/filter-more-elements.component';

// models
import { Request, PaginatedRequests } from './request.model';
import { ConsumerType, getConsumerTypeString } from '../consumer/consumer.enum';
import { PaginatedBrands } from '../filters/brand.model';
import { PaginatedModels } from '../filters/model.model';
import { PaginatedSubmodels } from '../filters/submodel.model';
import { PaginatedCategories } from '../filters/category.model';
import { IPageChangeEvent } from '@covalent/core';
import { FilterType } from '../filters/filter-type.enum';
import { IFilter } from '../filters/filter.model';

import { Router, NavigationEnd } from '@angular/router';
import { parseDate, PAGE_SIZE } from '../common';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})

export class RequestsComponent implements OnInit {
  requests: Request[] = [];
  activeFilters: IFilter[] = [];

  ConsumerType = ConsumerType;
  getConsumerTypeString = getConsumerTypeString;

  fromRow = 1;
  currentPage = 1;
  pageSize = PAGE_SIZE;

  selectedBrand;
  brands;
  showMoreBrands = false;
  selectedModel;
  models;
  showMoreModels = false;
  selectedSubmodel;
  submodels;
  showMoreSubmodels = false;

  selectedCategory;
  categories;
  showMoreCategories = false;

  selectedConsumerType;

  showFilters = false;

  requestsTotal: number = this.requests.length;

  parseDate = parseDate;

  SortType = SortType;

  sort;

  navigationSubscription;

  readonly REQUEST_FILTERS_KEY = "requestFilters"

  constructor(private requestService: RequestService, private router: Router,
    private _loadingService: TdLoadingService, private filterService: FilterService, public dialog: MatDialog) {

    this.activeFilters = this.getActiveFiltersFromLocalStorage()

    this.sort = SortType.newestFirst;

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.includes('requests')) {
        this.fetchData()
      }
    })
  }

  fetchData() {
    this.getRequests()
    this.getBrands()
    this.getCategories()
  }

  getActiveFiltersFromLocalStorage() {
    if (localStorage && localStorage.getItem(this.REQUEST_FILTERS_KEY)) {
      return JSON.parse(localStorage.getItem(this.REQUEST_FILTERS_KEY))
    }
    return []
  }

  addActiveFiltersToLocalStorage() {
    if (localStorage) {
      localStorage.setItem(this.REQUEST_FILTERS_KEY, JSON.stringify(this.activeFilters))
    }
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  getRequests() {
    this._loadingService.register('loadingRequests');

    let filters = {}

    for (let filter of this.activeFilters) {
      filters[filter.filterCode] = filter.filterValue
    }

    let sortValue
    let sortDirection
    switch (String(this.sort)) {
      case SortType.newestFirst:
        sortValue = "createdAt"
        sortDirection = -1
        break
      case SortType.oldestFirst:
        sortValue = "createdAt"
        sortDirection = 1
        break
      case SortType.brandAZ:
        sortValue = "brand"
        sortDirection = 1
        break
      case SortType.brandZA:
        sortValue = "brand"
        sortDirection = -1
        break
      default:
        sortValue = "createdAt"
        sortDirection = -1
    }
    this.requestService.getRequests(this.currentPage, filters, sortValue, sortDirection)
      .subscribe(
        response => this.loadRequests(response)
      );
  }

  onSortChange(newValue) {
    this.sort = newValue;
    this.getRequests()
  }

  loadRequests(response: PaginatedRequests) {
    this.requests = response.requests;
    this.requestsTotal = response.total;
    this._loadingService.resolve('loadingRequests');
  }

  getCategories() {
    this.filterService.getCategories(1)
      .subscribe(
        response => this.loadCategories(response)
      )
  }

  loadCategories(response: PaginatedCategories) {
    let allCategories = response.data
    if (allCategories.length > 9) {
      allCategories = allCategories.slice(0, 9);
      this.showMoreCategories = true;
    }
    this.categories = allCategories
  }

  onCategorySelected(category) {
    this.selectedCategory = category;
    this.addActiveFilter("category", category.name)
    this.getRequests()
  }

  showMoreCategoriesDialog() {
    this.showMoreFiltersDialog("Categoría", FilterType.category, (result) => {
      this.onCategorySelected(result)
    })
  }

  getBrands() {
    this.filterService.getBrands(1)
      .subscribe(
        response => this.loadBrands(response)
      )
  }

  loadBrands(response: PaginatedBrands) {
    let allBrands = response.data
    if (allBrands.length > 9) {
      allBrands = allBrands.slice(0, 9);
      this.showMoreBrands = true;
    }
    this.brands = allBrands
  }

  onBrandSelected(brand) {
    this.selectedBrand = brand;
    this.selectedModel = undefined;
    this.selectedSubmodel = undefined;
    this.addActiveFilter("brand", brand.name)
    this.getRequests()
    this.getModels()
  }

  showMoreBrandsDialog() {
    this.showMoreFiltersDialog("Marca", FilterType.brand, (result) => {
      this.onBrandSelected(result)
    })
  }

  getModels() {
    this.filterService.getModels(1, this.selectedBrand._id)
      .subscribe(
        response => this.loadModels(response)
      )
  }

  loadModels(response: PaginatedModels) {
    let allModels = response.data
    if (allModels.length > 9) {
      allModels = allModels.slice(0, 9);
      this.showMoreModels = true;
    }
    this.models = allModels
  }

  onModelSelected(model) {
    this.selectedModel = model;
    this.selectedSubmodel = undefined;
    this.addActiveFilter("model", model.name)
    this.getRequests()
    this.getSubmodels()
  }

  showMoreModelsDialog() {
    this.showMoreFiltersDialog("Modelo", FilterType.model, (result) => {
      this.onModelSelected(result)
    })
  }

  getSubmodels() {
    this.filterService.getSubmodels(1, this.selectedModel._id)
      .subscribe(
        response => this.loadSubmodels(response)
      )
  }

  loadSubmodels(response: PaginatedSubmodels) {
    let allSubmodels = response.data
    if (allSubmodels.length > 9) {
      allSubmodels = allSubmodels.slice(0, 9);
      this.showMoreSubmodels = true;
    }
    this.submodels = allSubmodels
  }

  onSubmodelSelected(submodel) {
    this.selectedSubmodel = submodel;
    this.addActiveFilter("submodel", submodel.name)
    this.getRequests()
  }

  showMoreSubmodelsDialog() {
    this.showMoreFiltersDialog("Versión", FilterType.submodel, (result) => {
      this.onSubmodelSelected(result)
    })
  }

  onConsumerTypeSelected(consumerType) {
    this.selectedConsumerType = consumerType
    this.addActiveFilter("consumerType", consumerType);
    this.getRequests()
  }

  showMoreFiltersDialog(title, filterType, callback) {
    const dialogRef = this.dialog.open(FilterMoreElementsDialog, {
      width: '50%',
      data: {
        title: title,
        filterType: filterType,
        brandId: this.selectedBrand ? this.selectedBrand._id : undefined,
        modelId: this.selectedModel ? this.selectedModel._id : undefined
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        callback(result)
      }
    });
  }

  showDetail(requestId: string) {
    this.router.navigate(['requests/' + requestId]);
  }

  addActiveFilter(name, value) {
    // allow more than one category filter
    let filterActive = this.findActiveFilter(name)

    this.currentPage = 1
    // if the filter is category or consumer type create a list of filter values
    if (name == 'category' || name == 'consumerType') {
      if (filterActive) {
        if (!filterActive.filterValue.find(activeFilterValue => activeFilterValue == value)) {
          filterActive.filterValue.push(value)
        }
        this.addActiveFiltersToLocalStorage()
        return
      } else {
        value = [value]
      }
    } else if (filterActive) {
      this.activeFilters.splice(this.activeFilters.indexOf(filterActive), 1);
    }

    this.activeFilters.push({ filterCode: name, filterValue: value })

    this.addActiveFiltersToLocalStorage()
  }

  findActiveFilter(filterCode) {
    return this.activeFilters.find(filter => filter.filterCode == filterCode)
  }

  removeFilter(filterName: string, subidx: number) {
    let filter = this.findActiveFilter(filterName)
    let subfilter
    if (subidx > -1) {
      subfilter = filter[subidx]
    }

    this.currentPage = 1;
    if (filter.filterCode == "brand") {
      this.activeFilters = this.activeFilters.filter(filter => {
        return filter.filterCode != "model" && filter.filterCode != "submodel"
      })
      this.selectedBrand = undefined;
      this.selectedModel = undefined;
      this.selectedSubmodel = undefined;
    } else if (filter.filterCode == "model") {
      this.activeFilters = this.activeFilters.filter(filter => {
        return filter.filterCode != "submodel"
      })
      this.selectedModel = undefined;
      this.selectedSubmodel = undefined;
    } else if (filter.filterCode == "submodel") {
      this.selectedSubmodel = undefined;
    } else if (filter.filterCode == 'category' ||  filter.filterCode == 'consumerType') {
      filter.filterValue.length > 1 ? filter.filterValue.splice(subidx, 1) : this.activeFilters.splice(this.activeFilters.indexOf(filter), 1)
      this.addActiveFiltersToLocalStorage()
      this.getRequests();
      return
    }
    this.activeFilters.splice(this.activeFilters.indexOf(filter), 1)
    this.addActiveFiltersToLocalStorage()
    this.getRequests();
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.getRequests()
  }

  toggleShowFilters() {
    this.showFilters = !this.showFilters
  }

  getConsumerTypeValues() {
    return Object.keys(ConsumerType).filter(key => isNaN(Number(ConsumerType[key]))).map(k => parseInt(k));
  }
}


enum SortType {
  newestFirst = "1",
  oldestFirst = "2",
  brandAZ = "3",
  brandZA = "4"
}
