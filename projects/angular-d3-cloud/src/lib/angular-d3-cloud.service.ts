import { inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import cloud from 'd3-cloud'
import { select, Selection } from 'd3-selection';
import 'd3-transition';
import { AngularD3CloudOptions, AngularD3Word } from './angular-d3-cloud.interfaces';
import { defaultFillMapper, defaultOptions } from './angular-d3-cloud.utilities';

@Injectable()
export class AngularD3CloudService {
  private static TAG = '[AngularD3CloudService]';  

  private ngZone: NgZone;
  private document: Document;
  public wordMouseClick: Subject<{ event: MouseEvent, word: AngularD3Word }>; 
  public wordMouseOver: Subject<{ event: MouseEvent, word: AngularD3Word }>; 
  public wordMouseMove: Subject<{ event: MouseEvent, word: AngularD3Word }>; 
  public wordMouseOut: Subject<{ event: MouseEvent, word: AngularD3Word }>; 

  constructor() {
    this.ngZone = inject(NgZone);
    this.document = inject(DOCUMENT);
    this.wordMouseClick = new Subject<{ event: MouseEvent, word: AngularD3Word }>(); 
    this.wordMouseOver = new Subject<{ event: MouseEvent, word: AngularD3Word }>(); 
    this.wordMouseMove = new Subject<{ event: MouseEvent, word: AngularD3Word }>(); 
    this.wordMouseOut = new Subject<{ event: MouseEvent, word: AngularD3Word }>();     
  }

  public renderCloud(node: Element | null, options: AngularD3CloudOptions = defaultOptions): TypeError[] | null {
    const errors = this.validateData(node, options);
    if(errors != null && errors.length > 0) {
      return errors;
    }

    this.render(node as Element, options);

    return null;
  }

  private render(node: Element, options: AngularD3CloudOptions): void {
    this.ngZone.runOutsideAngular(() => {

      let ngcontent: string;
      const attributes = node.getAttributeNames();
      if(attributes) {
        ngcontent = attributes.find((value: string) => value.startsWith('_ngcontent-')) as string;
      }      

      select(node).selectAll('*').remove();
  
      const layout = cloud<AngularD3Word>()
        .words(options.data)
        .size([options.width, options.height])
        .font(options.font)
        .fontStyle(options.fontStyle)
        .fontWeight(options.fontWeight) 
        .fontSize(options.fontSizeMapper)    
        .rotate(options.rotate) 
        .padding(options.padding)  
        .canvas(() => this.canvasGenerator() )
        .on('end', words => {
          const [w, h] = layout.size();
          const texts = select(node)
            .append('svg')
            .attr('width', w)
            .attr('height', h)
            .attr('viewBox', `0 0 ${w} ${h}`)
            .attr('preserveAspectRatio', 'xMinYMin meet')
            .attr(ngcontent, '')
            .classed(options.theme, true)
            .append('g')
            .attr('transform', `translate(${w / 2},${h / 2})`)
            .attr(ngcontent, '')
            .selectAll('text')
            .data(words)
            .enter()
            .append('text')
            .style('font-family', options.font)
            .style('font-style', options.fontStyle)
            .style('font-weight', options.fontWeight)
            .style('font-size', data => `${data.size}px`)
            .style('fill', (word, index) => this.applyFill(options, word, index))
            .attr('text-anchor', 'middle')     
            .attr(ngcontent, '')
            .text((data) => data.text);

          this.applyTooltip(options, texts);

          this.applyAnimation(options, texts);   
          
          this.applyEventListeners(options, texts);          
        });
  
        layout.start();      
    });    
  }

  private canvasGenerator(): HTMLCanvasElement {
    const canvas = this.document.createElement('canvas');
    canvas.getContext('2d', { willReadFrequently: true });
    return canvas;
  }

  private applyTooltip(options: AngularD3CloudOptions, texts: Selection<SVGTextElement, AngularD3Word, SVGGElement, unknown>): void {
    if(options.tooltip) {
      texts.append('title').text((data) => data.tooltip || data.text);
    }
  }

  private applyAnimation(options: AngularD3CloudOptions, texts: Selection<SVGTextElement, AngularD3Word, SVGGElement, unknown>): void {
    if(!options.animations) {
      texts
        .attr('transform', (data: AngularD3Word) => `translate(${[data.x, data.y]})rotate(${data.rotate})`)
        .style('font-size', (data: AngularD3Word) => `${data.size}px`)
        .style("fill-opacity", 1);
    } else {
      // Initial status
      texts
        .style('font-size', 1)
        .style('fill-opacity', 1e-6);

      //Entering and existing words
      texts
        .transition()
        .duration(options.speed)
        .attr('transform', (data: AngularD3Word) => `translate(${[data.x, data.y]})rotate(${data.rotate})`)
        .style('font-size', (data: AngularD3Word) => `${data.size}px`)
        .style('fill-opacity', 1);
    }
  }

  private applyEventListeners(options: AngularD3CloudOptions, texts: Selection<SVGTextElement, AngularD3Word, SVGGElement, unknown>): void {
    const _this = this;
    const applyCursorHover = (options.tooltip || options.hover || options.selection);

    texts.on('click', function(this: SVGTextElement, event: MouseEvent, word: AngularD3Word) {
      const text = select(this);

      if(options.selection) {        
        const selected = text.classed('text--selected');
        if(selected) {
          text.classed('text--selected', false);
        } else {
          texts.filter(function(this: SVGTextElement) { return select(this).classed('text--selected'); }).classed('text--selected', false);       
          text.classed('text--selected', true);
        }
      }
       
      if(options.mouseClickObserved) {     
        _this.wordMouseClick.next({ event, word });
      }                
    });   

    texts.on('mouseover', function(this: SVGTextElement, event: MouseEvent, word: AngularD3Word) {
      const text = select(this);

      if(applyCursorHover) {
        text.classed('cursor--hover', true);
      }

      if(options.hover) {
        text.classed('text--hover', true);
      }
      
      if(options.mouseOverObserved) {
        _this.wordMouseOver.next({ event, word });
      }              
    });   
    
    texts.on('mousemove', function(this: SVGTextElement, event: MouseEvent, word: AngularD3Word) {
      if(options.mouseMoveObserved) {
        _this.wordMouseMove.next({ event, word }); 
      }             
    });

    texts.on('mouseout', function(this: SVGTextElement, event: MouseEvent, word: AngularD3Word) {
      const text = select(this);

      if(applyCursorHover) {
        text.classed('cursor--hover', false);
      }

      if(options.hover) {        
        text.classed('text--hover', false);
      } 

      if(options.mouseOutObserved) {
        _this.wordMouseOut.next({ event, word });
      } 
    });
  }

  private applyFill(options: AngularD3CloudOptions, word: AngularD3Word, index: number): string | null {
    if (options.autoFill) {
      if(options.fillMapper) {
        return options.fillMapper(word, index);
      } else {
        return defaultFillMapper(word, index);
      }
    } else {
      return null;
    }
  }

  private validateData(node: Element | null, options: AngularD3CloudOptions): TypeError[] | null {
    const validated: TypeError[] = [];

    this.validateNode(validated, node);
    this.validateOptionsData(validated, options);
    this.validateHeight(validated, options);
    this.validateWidth(validated, options);
    this.validatePadding(validated, options);
    this.validateFont(validated, options);
    this.validateFontSizeMapper(validated, options);
    this.validateFillMapper(validated, options);  
    this.validateRotate(validated, options);
    this.validateAutoFill(validated, options);
    this.validateFontWeight(validated, options); 
    this.validateFontStyle(validated, options); 
    this.validateAnimations(validated, options); 
    this.validateSpeed(validated, options); 
    this.validateTooltip(validated, options); 
    this.validateHover(validated, options); 
    this.validateSelection(validated, options); 

    if(validated.length > 0) {
      return validated;
    }

    return null;
  }

  private validateNode(validated: TypeError[], node: Element | null): void {
    if (node === null || node === undefined) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [node] must be an element. Current value is: [${node}]`);
      validated.push(error);
    }
  }

  private validateOptionsData(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.data === null || options.data === undefined || !Array.isArray(options.data)) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [data] must be an array. Current value is: [${options.data}]`);
      validated.push(error);
    }
  }

  private validateHeight(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.height === null || options.height === undefined || isNaN(options.height) || options.height <= 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [height] must be a positive number (greater than 0). Current value is: [${options.height}]`);
      validated.push(error);
    }
  }

  private validateWidth(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.width === null || options.width === undefined || isNaN(options.width) || options.width <= 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [width] must be a positive number (greater than 0). Current value is: [${options.width}]`);
      validated.push(error);
    }
  }

  private validatePadding(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.padding === null || options.padding === undefined || isNaN(options.padding) || options.padding < 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [padding] must be a positive number. Current value is: [${options.padding}]`);
      validated.push(error);
    }
  }

  private validateFont(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.font === null || options.font === undefined || typeof options.font !== 'string') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [font] must be a string. Current value is: [${options.font}]`);
      validated.push(error);
    }
  }

  private validateFontSizeMapper(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.fontSizeMapper === null || options.fontSizeMapper === undefined || !['number', 'function'].includes(typeof options.fontSizeMapper) || options.fontSizeMapper < 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [fontSizeMapper] must be a positive number or function. Current value is: [${options.fontSizeMapper}]`);
      validated.push(error);
    }
  }

  private validateFillMapper(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.fillMapper === null || options.fillMapper === undefined || typeof options.fillMapper !== 'function') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [fillMapper] must be a function. Current value is: [${options.fillMapper}]`);
      validated.push(error);
    }
  }

  private validateRotate(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.rotate === null || options.rotate === undefined || !['number', 'function'].includes(typeof options.rotate) || options.rotate < 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [rotate] must be a positive number or function. Current value is: [${options.rotate}]`);
      validated.push(error);
    }
  }

  private validateAnimations(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.animations === null || options.animations === undefined || typeof options.animations !== 'boolean') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [animations] must be boolean. Current value is: [${options.animations}]`);
      validated.push(error);
    }
  }

  private validateSpeed(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.speed === null || options.speed === undefined || isNaN(options.speed) || options.speed <= 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [speed] must be a positive number (greater than 0). Current value is: [${options.speed}]`);
      validated.push(error);
    }
  }

  private validateAutoFill(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.autoFill === null || options.autoFill === undefined || typeof options.autoFill !== 'boolean') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [autoFill] must be boolean. Current value is: [${options.autoFill}]`);
      validated.push(error);
    }
  }

  private validateFontWeight(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.fontWeight === null || options.fontWeight === undefined || !['number', 'string'].includes(typeof options.fontWeight)) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [fontWeight] must be a positive number or a string. Current value is: [${options.fontWeight}]`);
      validated.push(error);
    }
  }

  private validateFontStyle(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.fontStyle === null || options.fontStyle === undefined || typeof options.fontStyle !== 'string') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [fontStyle] must be a string. Current value is: [${options.fontStyle}]`);
      validated.push(error);
    }
  }

  private validateTooltip(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.tooltip === null || options.tooltip === undefined || typeof options.tooltip !== 'boolean') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [tooltip] must be boolean. Current value is: [${options.tooltip}]`);
      validated.push(error);
    }
  }

  private validateHover(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.hover === null || options.hover === undefined || typeof options.hover !== 'boolean') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [hover] must be boolean. Current value is: [${options.hover}]`);
      validated.push(error);
    }
  }

  private validateSelection(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.selection === null || options.selection === undefined || typeof options.selection !== 'boolean') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [selection] must be boolean. Current value is: [${options.selection}]`);
      validated.push(error);
    }
  }
}
