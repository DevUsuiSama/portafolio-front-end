import { Select } from "src/app/models/elements";

function selectLevel(level: number): Select {
    return {
        formControlName: 'level' + level,
        default: 'Seleccionar un Nivel',
        options: [{
            name: 'Básico',
            value: '1'
        }, {
            name: 'Intermedio',
            value: '2'
        }, {
            name: 'Avanzado',
            value: '3'
        }]
    };
}

export const LIST_HARD_SKILLS = [{
    checkbox: {
        formControlName: 'arduino',
        label: 'Arduino',
        value: '1'
    },
    select: selectLevel(1)
}, {
    checkbox: {
        formControlName: 'cpp',
        label: 'C++',
        value: '2'
    },
    select: selectLevel(2)
}, {
    checkbox: {
        formControlName: 'csharp',
        label: 'C#',
        value: '3'
    },
    select: selectLevel(3)
}, {
    checkbox: {
        formControlName: 'css',
        label: 'CSS',
        value: '4'
    },
    select: selectLevel(4)
}, {
    checkbox: {
        formControlName: 'html',
        label: 'HTML',
        value: '5'
    },
    select: selectLevel(5)
}, {
    checkbox: {
        formControlName: 'dotnet',
        label: 'DOTNET',
        value: '6'
    },
    select: selectLevel(6)
}, {
    checkbox: {
        formControlName: 'git',
        label: 'GIT',
        value: '7'
    },
    select: selectLevel(7)
}, {
    checkbox: {
        formControlName: 'gtk',
        label: 'GTK',
        value: '8'
    },
    select: selectLevel(8)
}, {
    checkbox: {
        formControlName: 'js',
        label: 'JavaScript',
        value: '9'
    },
    select: selectLevel(9)
}, {
    checkbox: {
        formControlName: 'linux',
        label: 'Linux',
        value: '10'
    },
    select: selectLevel(10)
}, {
    checkbox: {
        formControlName: 'mysql',
        label: 'MySQL',
        value: '11'
    },
    select: selectLevel(11)
}, {
    checkbox: {
        formControlName: 'php',
        label: 'PHP',
        value: '12'
    },
    select: selectLevel(12)
}, {
    checkbox: {
        formControlName: 'ts',
        label: 'TypeScript',
        value: '13'
    },
    select: selectLevel(13)
}, {
    checkbox: {
        formControlName: 'java',
        label: 'JAVA',
        value: '14'
    },
    select: selectLevel(14)
}, {
    checkbox: {
        formControlName: 'angular',
        label: 'Angular',
        value: '15'
    },
    select: selectLevel(15)
}, {
    checkbox: {
        formControlName: 'bootstrap',
        label: 'Bootstrap',
        value: '16'
    },
    select: selectLevel(16)
}, {
    checkbox: {
        formControlName: 'spring',
        label: 'Spring',
        value: '17'
    },
    select: selectLevel(17)
}];
