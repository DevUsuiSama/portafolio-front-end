import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Button, General, InputCheckBox, InputSelectCheckBox } from 'src/app/models/elements';
import { SelectCheckBoxComponent } from './select-check-box/select-check-box.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass'],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .dark-modal .modal-content
      background-color: #000000
      color: white
      border: 1px solid cyan
      border-style: groove
      box-shadow: 0 0 .4rem 0 cyan
      border-radius: 2px
    .dark-modal .close
      color: white
  `]
})
export class ModalComponent {
  titleModal: string = '';
  message: string = '';
  button: Button[] = [];
  inputElement: General[] = [];
  lambda: Function = (form: any) => { };
  form?: any;
  disabled = false;
  inputSelectCheckBox: InputSelectCheckBox | any;
  stateSCheckBox: boolean = false; 
  inputCheckBox: InputCheckBox | any;
  stateCheckBox: boolean = false;

  @ViewChild('content', { static: false }) _content?: TemplateRef<any>;
  @ViewChild(SelectCheckBoxComponent) selectCheckBox?: SelectCheckBoxComponent;

  constructor(
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
  }

  setTitleModal(title: string) {
    this.titleModal = title;
  }

  openVerticallyCentered(content: any): NgbModalRef {
    return this.modalService.open(content, { centered: true, windowClass: 'dark-modal' });
  }

  messageBox(titleModal: string, message: string) {
    this.titleModal = titleModal;
    this.message = message;
  }

  generateButton(titleModal: string, button: Button[]) {
    this.titleModal = titleModal;
    this.button = button;
  }

  generateInput(input: General[], form: FormGroup, lambda: Function) {
    this.inputElement = input;
    this.form = form;
    this.lambda = lambda;
  }

  generateSelectCheckBox(inputSelectCheckBox: InputSelectCheckBox) {
    this.inputSelectCheckBox = inputSelectCheckBox;
    this.stateSCheckBox = true;
    this.stateCheckBox = false;
  }

  generateCheckBox(inputCheckBox: InputCheckBox) {
    this.inputCheckBox = inputCheckBox;
    this.stateCheckBox = true;
    this.stateSCheckBox = false;
  }

  toggleDisabled() {
    this.disabled = !this.disabled;
    if (this.disabled)
      this.form.get(this.inputElement[this.inputElement.length - 1].formControlName).disable();
    else
      this.form.get(this.inputElement[this.inputElement.length - 1].formControlName).enable();
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  get content() {
    return this._content;
  }
}
