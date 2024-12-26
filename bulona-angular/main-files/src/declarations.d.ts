declare module 'jspdf-autotable' {
    import { jsPDF } from 'jspdf';

    interface AutoTableOptions {
        head?: any[][];
        body?: any[][];
        // Puedes agregar más opciones según lo que necesites
    }

    export function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}
