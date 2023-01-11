export class General {
    type?: string;
    formControlName?: string;
    placeholder?: string;
    span?: string;
    class?: string;
    options?: string[];
    disabled?: boolean;
}

export class Button {
    title?: string;
    routerLink?: Array<string>;
}

export class Option {
    name?: string;
    value?: string;
}

export class Select {
    default?: string;
    formControlName?: string;
    options?: Option[];
}

export class CheckBox {
    formControlName?: string;
    value?: string;
    label?: string;
}

export class SelectCheckBox {
    checkbox?: CheckBox;
    select?: Select;
}

export class InputCheckBox {
    titulo?: string;
    checkbox?: CheckBox[];
    formulario?: any;
    onSubmit?: Function;
    
    constructor(
        titulo: string,
        checkbox: CheckBox[],
        formulario: any,
        onSubmit: Function
    ) {
        this.titulo = titulo;
        this.checkbox = checkbox;
        this.formulario = formulario;
        this.onSubmit = onSubmit;
    }
}

export class InputSelectCheckBox {
    titulo?: string;
    selectCheckBox?: SelectCheckBox[];
    formulario?: any;
    onSubmit?: Function;

    constructor(
        titulo: string,
        selectCheckBox: SelectCheckBox[],
        formulario: any,
        onSubmit: Function
    ) {
        this.titulo = titulo;
        this.selectCheckBox = selectCheckBox;
        this.formulario = formulario;
        this.onSubmit = onSubmit;
    }
}