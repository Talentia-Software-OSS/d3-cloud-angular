# Angular D3 Word Cloud
D3 Cloud component for Angular built upon d3-cloud

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/d3-cloud-angular)

## This version require Angular CLI 15

## Previous versions

<details>
  <summary>Click to expand</summary>

- [Version 1.3.0](https://github.com/Talentia-Software-OSS/d3-cloud-angular/tree/1.3.x)

</details>

<img src="./demo.png">

# Installation
```
npm install --save @talentia/angular-d3-cloud@1.4.6
```
Installing the package does not install the type definitions for d3-cloud, d3-scale, d3-scale-chromatic, d3-selection and d3-transition libraries.
If you need to use these libraries in your project then install the type definitions with the following command:

```
npm i --save-dev @types/d3-cloud@1.2.5 @types/d3-scale@4.0.2 @types/d3-scale-chromatic@3.0.0 @types/d3-selection@3.0.3 @types/d3-transition@3.0.2
```

# Usage
First import the package to your app module
```ts
// app.module.ts
import { AngularD3CloudModule } from '@talentia/angular-d3-cloud';

@NgModule({
  imports: [
    AngularD3CloudModule
  ],
  ...
})
```
Now the component is ready to use.

```html
<!-- app.component.html -->
<angular-d3-cloud [data]="data" [hover]="true" [selection]="true" [tooltip]="true"></angular-d3-cloud>
```
```ts
// app.component.ts
export class AppComponent implements OnInit {
   @Input() data!: AngularD3Word[];

     private words = ["Exercitation","duis","ex","laboris","est","aliqua","Lorem","veniam","ad","Minim","enim","do","exercitation","eiusmod","sunt","qui","Aliqua","velit","in","commodo","anim","Sunt","labore","dolor","non","culpa","proident","laborum","dolore","occaecat","mollit","ea","aute","excepteur","Labore","incididunt","tempor","Nisi","nostrud","deserunt","ipsum","adipisicing","pariatur","magna","Ut","aliquip","et","Pariatur","sint","ut","amet","id","eu","cillum","nulla","esse","elit","consequat","Ea","ullamco","Ad","voluptate","nisi","minim"];

   ngOnInit(): void {
    this.data = this.words.map((word) => {
      const value = 10 + Math.random() * 90;
      return { text: word, value: value, tooltip: `The value of ${word} is ${value}` } as AngularD3Word;
    });
  } 
}
```
# AngularD3CloudComponent Properties
| Name           | Description                                                                                        | Type                                                            | Required | Default             |
|----------------|----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|----------|---------------------|
| data           | Words array                                                                                        | AngularD3Word[]                                                 |     ✓    |                     |
| width          | Layout width (px)                                                                                  | number                                                          |          | 700                 |
| height         | Layout height (px)                                                                                 | number                                                          |          | 600                 |
| padding        | Padding between tags (px)                                                                          | number                                                          |          | 5                   |
| font           | Font family needed for calculating layout                                                          | string                                                          |          | Arial               |
| fontSizeMapper | Map each word value of data to font size (px)                                                      | number | ((word: AngularD3Word, index: number) => number)       |          | word => word.value  |
| rotate         | Rotation in degrees                                                                                | number | ((word: AngularD3Word, index: number) => number)       |          | 0                   |
| autoFill       | Whether words need to be filled with random colors                                                 | boolean                                                         |          | false               |
| fillMapper     | Function used by autoFill to map each data item to a fill color                                    | (word: AngularD3Word, index: number) => string                  |          | schemeCategory10    |
| animations     | Whether to apply animation                                                                         | boolean                                                         |          | false               |
| speed          | Animation speed (ms)                                                                               | number                                                          |          | 600                 |
| fontWeight     | Font weight                                                                                        | string | number                                                 |          | normal              |
| fontStyle      | Font style                                                                                         | string                                                          |          | normal              |
| tooltip        | Whether the tooltip should be shown                                                                | boolean                                                         |          | false               |
| hover          | Whether to apply the hover effect on the words                                                     | boolean                                                         |          | false               |
| selection      | Whether the word should be selectable                                                              | boolean                                                         |          | false               |
| theme          | Theme to apply on hover or selected words                                                          | AngularD3Themes                                                 |          | text-opacity        |

# AngularD3CloudComponent Events
| Name          | Description                                                                                         | Payload                                                         |
|---------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| wordClick     | Event triggered when click event triggered on a word                                                | { event: MouseEvent, word: AngularD3Word }                      |
| wordMouseOver | Event triggered when mouseover event triggered on a word                                            | { event: MouseEvent, word: AngularD3Word }                      |
| wordMouseMove | Event triggered when mousemove event triggered on a word                                            | { event: MouseEvent, word: AngularD3Word }                      |
| wordMouseOut  | Event triggered when mouseout event triggered on a word                                             | { event: MouseEvent, word: AngularD3Word }                      |

# AngularD3Word Interface
| Name          | Description                                                                                         | Type                                                            |
|---------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| value         | Value to map to font size                                                                           | number                                                          |
| tooltip       | Tooltip text                                                                                        | string                                                          |

# AngularD3Themes Type
| Name          | Description                                                                                         | Type                                                            |
|---------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| text-opacity  | Apply opacity effect on hover or selected words                                                     | string                                                          |
| text-shadow   | Apply shadow effect on hover or selected words                                                      | string                                                          |

> `AngularD3Word` extends the interface `Word` imported from `d3-cloud`

# Example
Run the following commands to start sample project:
```
npm start
```

# Thanks
This project is built with the idea of [React D3 Cloud](https://github.com/Yoctol/react-d3-cloud).  
This project is forked from [maitrungduc1410/d3-cloud-angular](https://github.com/maitrungduc1410/d3-cloud-angular).
