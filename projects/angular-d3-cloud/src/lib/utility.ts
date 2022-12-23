import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { Random } from 'random'
import { AngularD3CloudOptions, AngularD3Word } from "./angular-d3-cloud.interfaces";

const defaultRandom: Random = new Random();
const defaultFill: ScaleOrdinal<string, string, never> = scaleOrdinal(schemeCategory10);  
const defaultRotateScale: ScaleLinear<number, number, never> = scaleLinear().range([-90, 90]).domain([0, 1]);
const defaultFillMapper = (word: AngularD3Word, index: number): string => defaultFill(index.toString());
const defaultSizeMapper = (word: AngularD3Word, index: number): number => word.value;
const defaultRotate = (): number => defaultRotateScale(defaultRandom.next());

export const defaultOptions: AngularD3CloudOptions = {
  data: [],
  width: 700,
  height: 600,
  padding: 5,
  font: 'arial',
  fontSizeMapper: defaultSizeMapper,
  rotate: defaultRotate,
  autoFill: true,
  fillMapper: defaultFillMapper,
  animations: true,
  fontWeight: 'normal',
  mouseClickObserved: false,
  mouseOverObserved: false,
  mouseOutObserved: false
};