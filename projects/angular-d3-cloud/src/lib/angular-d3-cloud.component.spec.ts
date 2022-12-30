import { Component, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularD3CloudComponent } from './angular-d3-cloud.component';
import { AngularD3Word } from './angular-d3-cloud.interfaces';
import { AngularD3CloudModule } from './angular-d3-cloud.module';

describe('AngularD3CloudComponent', () => {
  let component: TestApp;
  let fixture: ComponentFixture<TestApp>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ TestApp, AngularD3CloudComponent ],
        imports: [ AngularD3CloudModule ]
      });

    fixture = TestBed.createComponent(TestApp);
    component = fixture.componentInstance;     
  });

  it('should create TestApp component', () => {   
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should create AngularD3CloudComponent component', () => {   
    fixture.detectChanges();
    expect(component.d3Cloud).toBeTruthy();
  });
});

@Component({
  selector: 'test-app',
  template: `
  <ng-container>
      <angular-d3-cloud #d3Cloud [data]="data"></angular-d3-cloud>
  </ng-container>
  `
})
class TestApp {
  @ViewChild("d3Cloud", { static: false }) d3Cloud!: AngularD3CloudComponent;

  @Input() data!: AngularD3Word[] | null;

  private words = ["Exercitation","duis","ex","laboris","est","aliqua","Lorem","veniam","ad","Minim","enim","do","exercitation","eiusmod","sunt","qui","Aliqua","velit","in","commodo","anim","Sunt","labore","dolor","non","culpa","proident","laborum","dolore","occaecat","mollit","ea","aute","excepteur","Labore","incididunt","tempor","Nisi","nostrud","deserunt","ipsum","adipisicing","pariatur","magna","Ut","aliquip","et","Pariatur","sint","ut","amet","id","eu","cillum","nulla","esse","elit","consequat","Ea","ullamco","Ad","voluptate","nisi","minim"];

  ngOnInit(): void {
      this.data = this.words.map((word) => {
          return { text: word, value: 10 + Math.random() * 90 } as AngularD3Word;
      });
  }
}