import { Detalle } from "./detalle";

export interface Liquidacion { 
    id?: number;    
    sociedad?: string;
    numePres?: string;
    nombActi?: string;
    detalles?: Detalle[];    
}