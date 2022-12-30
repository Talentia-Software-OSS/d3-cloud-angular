export interface AngularD3Word {
  text: string;
  value: number;  
  font: string;
  style: string;
  weight: string | number;
  rotate: number;
  size: number;
  padding: number;
  x: number;
  y: number;
  hasText: boolean;
}

export interface AngularD3CloudOptions {
  data: AngularD3Word[];
  width: number;
  height: number;
  padding: number;
  font: string;
  fontSizeMapper: number | ((word: AngularD3Word, index: number) => number);
  rotate: number | ((word: AngularD3Word, index: number) => number);
  autoFill: boolean;
  fillMapper: (word: AngularD3Word, index: number) => string;
  animations: boolean;
  speed: number;
  fontWeight: string | number;
  fontStyle: string;
  mouseClickObserved: boolean;
  mouseOverObserved: boolean;
  mouseOutObserved: boolean;
}