import { SimpleChanges } from "@angular/core";
import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { AngularD3CloudOptions, AngularD3Word } from "./angular-d3-cloud.interfaces";

class Random { 
  private readonly M = 2147483648;  
  private readonly A = 1103515245; 
  private readonly C = 12345;   
  private seed;   
  private R;

  constructor() {
    this.seed = +Date.now();
    this.R = this.seed % this.M;
  }

  nextInt(): number {
    this.R = (this.R * this.A + this.C) % this.M;
    return this.R;
  }

  nextFloat(): number {
      const value = this.nextInt();
      return value / this.M;
  }
}

const random = new Random();
const fill: ScaleOrdinal<string, string, never> = scaleOrdinal(schemeCategory10);  
const rotateScale: ScaleLinear<number, number, never> = scaleLinear().range([-90, 90]).domain([0, 1]);

export function clone(values: AngularD3Word[] | undefined): AngularD3Word[] {
  if(!values) {
    return [];
  }
  const result: AngularD3Word[] = [];
  values.forEach(value => result.push(Object.assign({}, value)));
  return result;
};
export function hasChanges(changes: SimpleChanges): boolean {
  let changed: boolean = false;
  const keys = Object.keys(changes);
  if(keys && keys.length > 0) {
    changed = keys.every(key => {
      return !changes[key].firstChange;
    });    
  }  
  return changed;
};
export const defaultRandom = (): number => random.nextFloat();
export const defaultFillMapper = (word: AngularD3Word, index: number): string => fill(index.toString());
export const defaultSizeMapper = (word: AngularD3Word, index: number): number => word.value;
export const defaultRotate = (): number => rotateScale(defaultRandom());
export const defaultOptions: AngularD3CloudOptions = {
  data: [],
  width: 700,
  height: 600,
  padding: 5,
  font: 'Arial',
  fontSizeMapper: defaultSizeMapper,
  rotate: defaultRotate,
  autoFill: true,
  fillMapper: defaultFillMapper,
  animations: true,
  speed: 600,
  fontWeight: 'normal',
  fontStyle: 'normal',
  mouseClickObserved: false,
  mouseOverObserved: false,
  mouseOutObserved: false
};