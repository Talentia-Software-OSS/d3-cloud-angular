import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularD3CloudModule, AngularD3Word } from '@talentia/angular-d3-cloud';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeBlues, schemeCategory10, schemeGreens, schemePastel1, schemePastel2 } from 'd3-scale-chromatic';
import { Random } from 'random';

@Component({
  selector: 'app-advanced',
  templateUrl: './advanced.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, AngularD3CloudModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedComponent implements OnInit {
  @Input() data!: AngularD3Word[];

  public schemas: any[] = [
    {"id": 0, "name": "Category10", "schema": schemeCategory10 },
    {"id": 1, "name": "Blues", "schema": schemeBlues[9] },
    {"id": 2, "name": "Greens", "schema": schemeGreens[9] },
    {"id": 3, "name": "Pastel1", "schema": schemePastel1 },
    {"id": 4, "name": "Pastel2", "schema": schemePastel2 }
  ];
  public fonts: string[] = ["Arial", "Verdana", "Impact", "Times New Roman", "Georgia", "Courier", "Lucida", "Monaco", "Comic Sans MS" ];
  public paddings: number[] = [0, 1, 2, 3, 4, 5];

  public rotate!: number | ((word: AngularD3Word, index: number) => number);
  public fillMapper!: (word: AngularD3Word, index: number) => string; 
  public animations: boolean = true;
  public autoFill: boolean = true;
  public font: string = "Arial";
  public padding: number = 5;

  private _rotation: boolean = true;
  public get rotation(): boolean {
    return this._rotation;
  }
  public set rotation(value: boolean) {
    this._rotation = value;
    this.applyRotation();      
  }
  private _fillScheme: number = 0;
  public get fillScheme(): number {
    return this._fillScheme;
  }
  public set fillScheme(value: number) {
    this._fillScheme = value;
    this.applyFillMapper(); 
  }

  private words = ['Exercitation', 'duis', 'ex', 'laboris', 'laboris', 'est', 'aliqua', 'Lorem', 'veniam', 'ad.', 'Minim', 'aliqua', 'enim', 'do', 'exercitation', 'duis', 'eiusmod', 'sunt', 'do', 'exercitation', 'qui', 'ex.', 'Aliqua', 'velit', 'sunt', 'in', 'commodo', 'anim.', 'Sunt', 'labore', 'sunt', 'dolor', 'exercitation', 'non', 'commodo', 'laboris', 'culpa', 'culpa', 'exercitation', 'ex', 'proident', 'laborum.\n\nId', 'dolore', 'commodo', 'occaecat', 'in', 'velit.', 'Aliqua', 'mollit', 'ea', 'qui', 'ad', 'aute', 'est', 'excepteur', 'non', 'aliqua', 'occaecat', 'ad', 'non', 'ea.', 'Labore', 'incididunt', 'excepteur', 'tempor', 'culpa', 'proident', 'ex', 'commodo.', 'Nisi', 'nostrud', 'tempor', 'deserunt', 'ipsum', 'adipisicing', 'aute', 'do', 'adipisicing.\n\nOfficia', 'pariatur', 'eiusmod', 'tempor', 'magna', 'occaecat.', 'Ut', 'proident', 'anim', 'aute', 'aliquip', 'pariatur', 'et.', 'Pariatur', 'ad', 'ea', 'sint', 'ut', 'excepteur', 'amet', 'id', 'do.', 'Labore', 'eu', 'velit', 'non', 'cillum', 'nulla.\n\nIncididunt', 'duis', 'tempor', 'sunt', 'dolor', 'magna', 'occaecat', 'esse', 'elit', 'consequat.', 'Ea', 'sint', 'et', 'labore', 'amet', 'ullamco', 'non', 'tempor.', 'Ad', 'voluptate', 'nisi', 'duis', 'minim', 'elit', 'in', 'adipisicing', 'et', 'laboris', 'nulla', 'culpa', 'ad'];
  private random = new Random();
  private fillSchema = (schema: readonly string[]) => scaleOrdinal(schema);
  private rotateScale = scaleLinear().range([-90, 90]).domain([0, 1]);

  ngOnInit(): void {   
    this.data = this.words.map((word) => {
      return { text: word, value: 10 + this.random.next() * 90 };
    });
    this.applyRotation();
    this.applyFillMapper();
  } 

  onWordClick(data: { event: MouseEvent, word: AngularD3Word }): void {
    console.log(data.event?.type, data.word);
  }

  private applyRotation(): void {
    this.rotate = (this._rotation) ? () => this.rotateScale(this.random.next()) : 0;
  }

  private applyFillMapper(): void {
    const schema = this.schemas[this._fillScheme].schema;
    const fillFunction = this.fillSchema(schema);
    this.fillMapper = (word: AngularD3Word, index: number): string => {      
      return fillFunction(index.toString());
    }
  }
}
