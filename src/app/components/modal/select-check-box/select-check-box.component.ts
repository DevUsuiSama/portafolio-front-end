import { Component, Input } from '@angular/core';
import { InputSelectCheckBox } from 'src/app/models/elements';

@Component({
  selector: 'app-select-check-box',
  templateUrl: './select-check-box.component.html',
  styleUrls: ['./select-check-box.component.sass']
})
export class SelectCheckBoxComponent {
  @Input() modal: any;
  @Input() inputSelectCheckBox?: InputSelectCheckBox;

  toggleEnable(checkbox: string | any, list: string | any) {
    if (!this.inputSelectCheckBox?.formulario.get(checkbox).value)
      this.inputSelectCheckBox?.formulario.get(list).enable()
    else
      this.inputSelectCheckBox?.formulario.get(list).disable()
  }
}
