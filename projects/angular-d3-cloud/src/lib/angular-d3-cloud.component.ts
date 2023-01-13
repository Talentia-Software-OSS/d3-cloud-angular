import { Component, ElementRef, EventEmitter, Input, OnChanges, AfterViewInit, Output, SimpleChanges, ViewChild, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularD3CloudOptions, AngularD3Word, AngularD3Themes } from './angular-d3-cloud.interfaces';
import { AngularD3CloudService } from './angular-d3-cloud.service';
import { clone, defaultOptions, hasChanges } from './angular-d3-cloud.utilities';

@Component({
  selector: 'angular-d3-cloud',
  templateUrl: './angular-d3-cloud.component.html',
  styleUrls: ['./angular-d3-cloud.component.scss']
})
export class AngularD3CloudComponent implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('wordcloud', { static: false }) wordcloud: ElementRef<HTMLDivElement> | undefined;

  @Input() data: AngularD3Word[] = [];
  @Input() width: number = defaultOptions.width;
  @Input() height: number = defaultOptions.height;
  @Input() padding: number = defaultOptions.padding;
  @Input() font: string = defaultOptions.font;
  @Input() fontSizeMapper: number | ((word: AngularD3Word, index: number) => number) = defaultOptions.fontSizeMapper;
  @Input() rotate: number | ((word: AngularD3Word, index: number) => number) = defaultOptions.rotate;
  @Input() autoFill: boolean = defaultOptions.autoFill;
  @Input() fillMapper: (word: AngularD3Word, index: number) => string = defaultOptions.fillMapper;
  @Input() animations: boolean = defaultOptions.animations;
  @Input() speed: number = defaultOptions.speed;
  @Input() fontWeight: string | number = defaultOptions.fontWeight;
  @Input() fontStyle: string = defaultOptions.fontStyle;
  @Input() tooltip: boolean = defaultOptions.tooltip;
  @Input() hover: boolean = defaultOptions.hover;
  @Input() selection: boolean = defaultOptions.selection;
  @Input() theme: AngularD3Themes = defaultOptions.theme;

  @Output() wordClick = new EventEmitter<{ event: MouseEvent, word: AngularD3Word }>();
  @Output() wordMouseOver = new EventEmitter<{ event: MouseEvent, word: AngularD3Word }>();
  @Output() wordMouseMove = new EventEmitter<{ event: MouseEvent, word: AngularD3Word }>();
  @Output() wordMouseOut = new EventEmitter<{ event: MouseEvent, word: AngularD3Word }>();

  private cloudService: AngularD3CloudService;
  private options: AngularD3CloudOptions;
  private wordMouseClickSubscriber: Subscription;
  private wordMouseOverSubscriber: Subscription;
  private wordMouseMoveSubscriber: Subscription;
  private wordMouseOutSubscriber: Subscription;

  constructor() { 
    this.cloudService = inject(AngularD3CloudService);
    this.options = this.createOptions();

    this.wordMouseClickSubscriber = this.cloudService.wordMouseClick.subscribe((value: { event: MouseEvent; word: AngularD3Word; }) => {
      this.wordClick.emit(value);
    });   
    this.wordMouseOverSubscriber = this.cloudService.wordMouseOver.subscribe((value: { event: MouseEvent; word: AngularD3Word; }) => {
      this.wordMouseOver.emit(value);
    });
    this.wordMouseMoveSubscriber = this.cloudService.wordMouseMove.subscribe((value: { event: MouseEvent; word: AngularD3Word; }) => {
      this.wordMouseMove.emit(value);
    });
    this.wordMouseOutSubscriber = this.cloudService.wordMouseOut.subscribe((value: { event: MouseEvent; word: AngularD3Word; }) => {
      this.wordMouseOut.emit(value);
    });
  }

  ngAfterViewInit(): void {
    this.renderCloud(); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(hasChanges(changes)) {
      this.renderCloud();
    }   
  }

  ngOnDestroy(): void {
    if(this.wordMouseClickSubscriber) {
      this.wordMouseClickSubscriber.unsubscribe();
    }  
    
    if(this.wordMouseOverSubscriber) {
      this.wordMouseOverSubscriber.unsubscribe();
    } 

    if(this.wordMouseMoveSubscriber) {
      this.wordMouseMoveSubscriber.unsubscribe();
    } 

    if(this.wordMouseOutSubscriber) {
      this.wordMouseOutSubscriber.unsubscribe();
    } 
  }

  private renderCloud(): void {
    if (this.wordcloud != null) {
      const errors = this.cloudService.renderCloud(this.wordcloud?.nativeElement, this.applyOptions());
      if(errors != null && errors.length > 0) {
        const messages = errors.map((error) => error.message);
        console.error(...messages);
      }     
    }  
  }

  private createOptions(): AngularD3CloudOptions {
    return {
      data: this.data,
      width: this.width,
      height: this.height,
      padding: this.padding,
      font: this.font,
      fontSizeMapper: this.fontSizeMapper,
      rotate: this.rotate,
      autoFill: this.autoFill,
      fillMapper: this.fillMapper,
      animations: this.animations,
      speed: this.speed,
      fontWeight: this.fontWeight,
      fontStyle: this.fontStyle,
      tooltip: this.tooltip,
      hover: this.hover,
      selection: this.selection,
      theme: this.theme,
      mouseClickObserved: this.wordClick.observed,
      mouseOverObserved: this.wordMouseOver.observed,
      mouseMoveObserved: this.wordMouseMove.observed,
      mouseOutObserved: this.wordMouseOut.observed
    };
  }

  private applyOptions(): AngularD3CloudOptions {
    this.options.data = clone(this.data);
    this.options.width = this.width;
    this.options.height = this.height;
    this.options.padding = this.padding;
    this.options.font = this.font;
    this.options.fontSizeMapper = this.fontSizeMapper;
    this.options.rotate = this.rotate;
    this.options.autoFill = this.autoFill;
    this.options.fillMapper = this.fillMapper;
    this.options.animations = this.animations;
    this.options.speed = this.speed;
    this.options.fontWeight = this.fontWeight;
    this.options.fontStyle = this.fontStyle;
    this.options.tooltip = this.tooltip;
    this.options.hover = this.hover;
    this.options.selection = this.selection;
    this.options.theme = this.theme;
    this.options.mouseClickObserved = this.wordClick.observed;
    this.options.mouseOverObserved = this.wordMouseOver.observed;
    this.options.mouseMoveObserved = this.wordMouseMove.observed;
    this.options.mouseOutObserved = this.wordMouseOut.observed;   
    
    return this.options;
  }
}
