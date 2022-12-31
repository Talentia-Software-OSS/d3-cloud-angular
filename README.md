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
npm install --save @talentia/angular-d3-cloud@1.4.3
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
<angular-d3-cloud [data]="data"></angular-d3-cloud>
```
```ts
// app.component.ts
export class AppComponent implements OnInit {
   @Input() data!: AngularD3Word[];

     private words = ["Exercitation","duis","ex","laboris","est","aliqua","Lorem","veniam","ad","Minim","enim","do","exercitation","eiusmod","sunt","qui","Aliqua","velit","in","commodo","anim","Sunt","labore","dolor","non","culpa","proident","laborum","dolore","occaecat","mollit","ea","aute","excepteur","Labore","incididunt","tempor","Nisi","nostrud","deserunt","ipsum","adipisicing","pariatur","magna","Ut","aliquip","et","Pariatur","sint","ut","amet","id","eu","cillum","nulla","esse","elit","consequat","Ea","ullamco","Ad","voluptate","nisi","minim"];

   ngOnInit(): void {
    this.data = this.words.map((word) => {
      return { text: word, value: 10 + Math.random() * 90 } as AngularD3Word;
    });
  } 
}
```
# Props
| Name           | Description                                                                                        | Type                                                            | Required | Default             |
|----------------|----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|----------|---------------------|
| data           | The input data for rendering                                                                       | AngularD3Word[]                                                 |     ✓    |                     |
| width          | Width of component (px)                                                                            | number                                                          |          | 700                 |
| height         | Height of component (px)                                                                           | number                                                          |          | 600                 |
| padding        | Map each element of data to font padding. Or simply provide a number for global padding. (px)      | number                                                          |          | 5                   |
| font           | The font of text shown                                                                             | string                                                          |          | Arial               |
| fontSizeMapper | Map each element of data to font size (px)                                                         | number or ((word: AngularD3Word, index: number) => number)      |          | word => word.value  |
| rotate         | Map each element of data to font rotation degree.                                                  | number or ((word: AngularD3Word, index: number) => number)      |          | 0                   |
|                | Or simply provide a number for global rotation. (degree)                                           |                                                                 |          |                     |
| autoFill       | Whether texts should be fill with random color or not                                              | boolean                                                         |          | false               |
| fillMapper     | Function used by autoFill to map each data item to a fill color.                                   | (word: AngularD3Word, index: number) => string                  |          | function based on   |
|                |                                                                                                    |                                                                 |          | schemeCategory10    |
| animations     | Whether animated transitions is active or not                                                      | boolean                                                         |          | false               |
| speed          | Animation speed (ms)                                                                               | number                                                          |          | 600                 |
| fontWeight     | Weight of the font                                                                                 | string or number                                                |          | normal              |
| fontStyle      | Style of the font                                                                                  | string                                                          |          | normal              |

# Events
| Name          | Description                                                                                         | Payload                                                         |
|---------------|-----------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| wordClick     | Event triggered when click event triggered on a word                                                | { event: MouseEvent, word: AngularD3Word }                      |
| wordMouseOver | Event triggered when mouseover event triggered on a word                                            | { event: MouseEvent, word: AngularD3Word }                      |
| wordMouseOut  | Event triggered when mouseout event triggered on a word                                             | { event: MouseEvent, word: AngularD3Word }                      |

> `AngularD3Word` extends the interface `Word` imported from `d3-cloud`
# Example
Run the following commands to start sample project:
```
npm start
```
# Thanks
This project is built with the idea of [React D3 Cloud](https://github.com/Yoctol/react-d3-cloud).  
This project is forked from [maitrungduc1410/d3-cloud-angular](https://github.com/maitrungduc1410/d3-cloud-angular).
