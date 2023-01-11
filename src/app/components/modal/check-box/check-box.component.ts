import { Component, Input } from '@angular/core';
import { InputCheckBox } from 'src/app/models/elements';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.sass']
})
export class CheckBoxComponent {
  @Input() modal: any;
  @Input() inputCheckBox?: InputCheckBox;
}
