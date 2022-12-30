import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AngularD3CloudModule, AngularD3Word } from '@talentia/angular-d3-cloud';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  standalone: true,
  imports: [AngularD3CloudModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleComponent implements OnInit {
  @Input() data!: AngularD3Word[];

  private words = ["Exercitation","duis","ex","laboris","est","aliqua","Lorem","veniam","ad","Minim","enim","do","exercitation","eiusmod","sunt","qui","Aliqua","velit","in","commodo","anim","Sunt","labore","dolor","non","culpa","proident","laborum","dolore","occaecat","mollit","ea","aute","excepteur","Labore","incididunt","tempor","Nisi","nostrud","deserunt","ipsum","adipisicing","pariatur","magna","Ut","aliquip","et","Pariatur","sint","ut","amet","id","eu","cillum","nulla","esse","elit","consequat","Ea","ullamco","Ad","voluptate","nisi","minim"];

  ngOnInit(): void {
    this.data = this.words.map((word) => {
      return { text: word, value: 10 + Math.random() * 90 } as AngularD3Word;
    });
  } 
}
