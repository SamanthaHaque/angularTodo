import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import { ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'angularCrud13';
  displayedColumns: string[] = ['productName', 'category','date','freshness' , 'price','comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;

  constructor(private dialog : MatDialog,private api : ApiService){

  }
 
  ngOnInit(): void {
    this.getAllProduct();
  }
  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent,{
      width: '30%'
    }).afterClosed().subscribe(val=>{
      if(val === 'saved'){
        this.getAllProduct();
      }
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
  getAllProduct(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
       this.dataSource = new MatTableDataSource(res);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert('error while fetching the records');
      }
    })
  }
  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      width: '30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === "updated"){
        this.getAllProduct();
      }
    })
  }
  deleteProduct(id:any){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
         alert("product deleted successfully");
         this.getAllProduct();
      },
      error:()=>{
        alert("error occurred while deleting");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
