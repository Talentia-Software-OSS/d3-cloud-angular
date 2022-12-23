import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import cloud from 'd3-cloud'
import { select } from 'd3-selection';
import 'd3-transition';
import { AngularD3CloudOptions, AngularD3Word } from './angular-d3-cloud.interfaces';
import { defaultOptions } from './utility';

@Injectable()
export class AngularD3CloudService {
  private static TAG = '[AngularD3CloudService]';  

  private document: Document;
  public wordMouseClick:Subject<{ event: MouseEvent, word: AngularD3Word }>; 
  public wordMouseOver:Subject<{ event: MouseEvent, word: AngularD3Word }>; 
  public wordMouseOut:Subject<{ event: MouseEvent, word: AngularD3Word }>; 

  constructor() {
    this.document = inject(DOCUMENT);
    this.wordMouseClick = new Subject<{ event: MouseEvent, word: AngularD3Word }>(); 
    this.wordMouseOver = new Subject<{ event: MouseEvent, word: AngularD3Word }>(); 
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
    select(node)
      .selectAll('*')
      .remove();
  
    const layout = cloud()
      .size([options.width!, options.height!])
      .font(options.font as any)
      .fontWeight(options.fontWeight as any)
      .words(options.data as any)
      .padding(options.padding as any)
      .rotate(options.rotate as any)
      .fontSize(options.fontSizeMapper as any)
      .canvas(() => this.canvasGenerator() )
      .on('end', words => {
        const texts = select(node)
          .append('svg')
          .attr('width', layout.size()[0])
          .attr('height', layout.size()[1])
          .append('g')
          .attr(
            'transform',
            `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
          )
          .selectAll('text')
          .data(words)
          .enter()
          .append('text')
          .style('font-family', options.font as any)
          .style('font-weight', options.fontWeight as any)
          .style('fill', (word, index) => {
            if (options.autoFill) {
              if(options.fillMapper) {
                return options.fillMapper(word as AngularD3Word, index);
              } else {
                return defaultOptions.fillMapper!(word as AngularD3Word, index);
              }                
            } else {
              return null;
            }
          })
          .attr('text-anchor', 'middle')
          .text((data: any) => data.text);

        if(!options.animations) {
          texts
            .attr('transform', data => `translate(${[data.x, data.y]})rotate(${data.rotate})`)
            .style('font-size', data => `${data.size}px`)
            .style("fill-opacity", 1);
        } else {
          // Initial status
          texts
            .style('font-size', 1)
            .style("fill-opacity", 1e-6);

          //Entering and existing words
          texts
            .transition()
            .duration(600)
            .attr('transform', data => `translate(${[data.x, data.y]})rotate(${data.rotate})`)
            .style('font-size', data => `${data.size}px`)
            .style("fill-opacity", 1);
        }

        if(options.mouseClickObserved) {
          texts.on('click', (event: MouseEvent, word: any) => {
            this.wordMouseClick.next({ event, word });
          });
        }        
        
        if(options.mouseOverObserved) {
          texts.on('mouseover', (event: MouseEvent, word: any) => {
            this.wordMouseOver.next({ event, word });
          });
        }        

        if(options.mouseOutObserved) {
          texts.on('mouseout', (event: MouseEvent, word: any) => {
            this.wordMouseOut.next({ event, word });
          });
        }        
      });

      layout.start();
  }

  private canvasGenerator(): HTMLCanvasElement {
    const canvas = this.document.createElement('canvas');
    canvas.getContext("2d", { willReadFrequently: true });
    return canvas;
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

    if(validated.length > 0) {
      return validated;
    }

    return null;
  }

  private validateNode(validated: TypeError[], node: Element | null): void {
    if (!node) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [node] must be an element. Current value is: [${node}]`);
      validated.push(error);
    }
  }

  private validateOptionsData(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (!options.data || !Array.isArray(options.data)) {
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
    if (options.padding == null || options.padding === undefined || !['number', 'function'].includes(typeof options.padding) || options.padding < 0) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [padding] must be a positive number or function. Current value is: [${options.padding}]`);
      validated.push(error);
    }
  }

  private validateFont(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.font === null || options.font === undefined || !['string', 'function'].includes(typeof options.font)) {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [font] must be a positive string or function. Current value is: [${options.font}]`);
      validated.push(error);
    }
  }

  private validateFontSizeMapper(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (!options.fontSizeMapper || typeof options.fontSizeMapper !== 'function') {
      const error = new TypeError(`${AngularD3CloudService.TAG}: [fontSizeMapper] must be a function. Current value is: [${options.fontSizeMapper}]`);
      validated.push(error);
    }
  }

  private validateFillMapper(validated: TypeError[], options: AngularD3CloudOptions): void {
    if (options.fillMapper && typeof options.fillMapper !== 'function') {
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
}
