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

  private words = ['Exercitation', 'duis', 'ex', 'laboris', 'laboris', 'est', 'aliqua', 'Lorem', 'veniam', 'ad.', 'Minim', 'aliqua', 'enim', 'do', 'exercitation', 'duis', 'eiusmod', 'sunt', 'do', 'exercitation', 'qui', 'ex.', 'Aliqua', 'velit', 'sunt', 'in', 'commodo', 'anim.', 'Sunt', 'labore', 'sunt', 'dolor', 'exercitation', 'non', 'commodo', 'laboris', 'culpa', 'culpa', 'exercitation', 'ex', 'proident', 'laborum.\n\nId', 'dolore', 'commodo', 'occaecat', 'in', 'velit.', 'Aliqua', 'mollit', 'ea', 'qui', 'ad', 'aute', 'est', 'excepteur', 'non', 'aliqua', 'occaecat', 'ad', 'non', 'ea.', 'Labore', 'incididunt', 'excepteur', 'tempor', 'culpa', 'proident', 'ex', 'commodo.', 'Nisi', 'nostrud', 'tempor', 'deserunt', 'ipsum', 'adipisicing', 'aute', 'do', 'adipisicing.\n\nOfficia', 'pariatur', 'eiusmod', 'tempor', 'magna', 'occaecat.', 'Ut', 'proident', 'anim', 'aute', 'aliquip', 'pariatur', 'et.', 'Pariatur', 'ad', 'ea', 'sint', 'ut', 'excepteur', 'amet', 'id', 'do.', 'Labore', 'eu', 'velit', 'non', 'cillum', 'nulla.\n\nIncididunt', 'duis', 'tempor', 'sunt', 'dolor', 'magna', 'occaecat', 'esse', 'elit', 'consequat.', 'Ea', 'sint', 'et', 'labore', 'amet', 'ullamco', 'non', 'tempor.', 'Ad', 'voluptate', 'nisi', 'duis', 'minim', 'elit', 'in', 'adipisicing', 'et', 'laboris', 'nulla', 'culpa', 'ad'];

  ngOnInit(): void {
      this.refresh();
  } 

  refresh(): void {
      this.data = this.words.map((word) => {
          return { text: word, value: 10 + Math.random() * 90 } as AngularD3Word;
      });
  }
}