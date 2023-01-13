import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { schemeBlues, schemeCategory10, schemeGreens, schemePastel1, schemePastel2 } from 'd3-scale-chromatic';
import { AngularD3CloudModule, AngularD3Word, AngularD3Themes } from '@talentia/angular-d3-cloud';

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
  public fonts: string[] = ["Arial", "Verdana", "Impact", "Times New Roman", "Georgia", "Courier", "Lucida", "Monaco", "Comic Sans MS"];
  public weights: any[] = [
    { "text": "Thin", "value": 100},
    { "text": "Extra Light", "value": 200},
    { "text": "Light", "value": 300},
    { "text": "Normal", "value": 400},
    { "text": "Medium", "value": 500},
    { "text": "Semi Bold", "value": 600},
    { "text": "Bold", "value": 700},
    { "text": "Extra Bold", "value": 800},
    { "text": "Black ", "value": 900}
   ];
  public styles: string[] = [ "normal", "italic"];
  public paddings: number[] = [0, 1, 2, 3, 4, 5];
  public speeds: number[] = [100, 300, 600, 1000];
  public themes: string[] = [ "text-opacity", "text-shadow"];

  public rotate!: number | ((word: AngularD3Word, index: number) => number);
  public fillMapper!: (word: AngularD3Word, index: number) => string; 
  public animations: boolean = true;
  public speed: number = 600;
  public autoFill: boolean = true;
  public font: string = "Arial";
  public weight: number = 400;
  public style: string = "normal";
  public padding: number = 5;
  public tooltip: boolean = true;
  public hover: boolean = true;
  public selection: boolean = true;
  public theme: AngularD3Themes = "text-opacity";

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

  private words = ["Exercitation","duis","ex","laboris","est","aliqua","Lorem","veniam","ad","Minim","enim","do","exercitation","eiusmod","sunt","qui","Aliqua","velit","in","commodo","anim","Sunt","labore","dolor","non","culpa","proident","laborum","dolore","occaecat","mollit","ea","aute","excepteur","Labore","incididunt","tempor","Nisi","nostrud","deserunt","ipsum","adipisicing","pariatur","magna","Ut","aliquip","et","Pariatur","sint","ut","amet","id","eu","cillum","nulla","esse","elit","consequat","Ea","ullamco","Ad","voluptate","nisi","minim"];
  private fillSchema = (schema: readonly string[]) => scaleOrdinal(schema);
  private rotateScale = scaleLinear().range([-90, 90]).domain([0, 1]);

  ngOnInit(): void {   
    this.data = this.words.map((word) => {
      const value = 10 + Math.random() * 90;
      return { text: word, value: value, tooltip: `The value of ${word} is ${value}` } as AngularD3Word;
    });
    this.applyRotation();
    this.applyFillMapper();
  } 

  onWordClick(data: { event: MouseEvent, word: AngularD3Word }): void {
    console.log(data.event?.type, data.event, data.word);
  }

  onWordMouseOver(data: { event: MouseEvent, word: AngularD3Word }): void {
    console.log(data.event?.type, data.event, data.word);
  }

  onWordMouseMove(data: { event: MouseEvent, word: AngularD3Word }): void {
    console.log(data.event?.type, data.event, data.word);
  }

  onWordMouseOut(data: { event: MouseEvent, word: AngularD3Word }): void {
    console.log(data.event?.type, data.event, data.word);
  }

  private applyRotation(): void {
    this.rotate = (this._rotation) ? () => this.rotateScale(Math.random()) : 0;
  }

  private applyFillMapper(): void {
    const schema = this.schemas[this._fillScheme].schema;
    const fillFunction = this.fillSchema(schema);
    this.fillMapper = (word: AngularD3Word, index: number): string => {      
      return fillFunction(index.toString());
    }
  }
}
