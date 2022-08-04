import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/Product';
import { ProductService } from 'src/app/services/product.service';
import { __metadata } from 'tslib';
import { Input, Output,  } from '@angular/core';
 @Component ({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  // templateUrl: './product-list-table.component.html',
  // templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId : any = 1;
  previousCategoryId: number = 1;
  searchMode : boolean = false;
//prop for pagination
  thePageNumber : number = 1;
  thePageSize : number = 1;
  theTotalElements : number = 0;

  constructor(private productService : ProductService,
              private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts() : void {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode)
    {
      this.searchProducts();
    }
    else
    {
      this.handleListProduct();
    }
  }

  searchProducts() {
    const theKeyword : any = this.route.snapshot.paramMap.get('keyword');
        
      this.productService.searchProducts(theKeyword).subscribe(
        data => {
          this.products = data;
        }
      )

  }
  handleListProduct() : any {

   // check if "id" parameter is available
   const hasCategoryId : boolean = this.route.snapshot.paramMap.has('id');

   if (hasCategoryId)
   {
     // get the "id" param string , convert string to a number using the "+" symbol
     this.currentCategoryId = this.route.snapshot.paramMap.get('id');
   }
   else{
     // not cayegory is available ... default to category is 1
     this.currentCategoryId = 1;
   }
   //
   //check if we have a diffrent category than previous
   //note : Angular will reuse a component if it is curently being viewed
   //

   //if we have a difrent category id then previous
   //then set thePageNo back to 1

   if(this.previousCategoryId != this.currentCategoryId)
   {
    this.thePageNumber = 1;
   }

   this.previousCategoryId = this.currentCategoryId;

   console.log(`currentCategoryId=${this.currentCategoryId} , thePageNumber=${this.thePageNumber}`);



   // now get the products for the given category id

   this.productService.getProdustListPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.processResult());
   
 }

 processResult() : any {
   return (data : any) =>   {
    this.products = data._embedded.products;
    this.thePageNumber = data.page.number + 1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElements;
   };
 }

updatePageSize(pageSize : number) : void {
this.thePageSize = pageSize;
this.thePageNumber = 1;
this.listProducts();
 }

}
