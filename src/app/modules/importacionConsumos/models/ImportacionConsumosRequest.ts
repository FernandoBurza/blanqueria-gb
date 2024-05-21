import { CombustibleComercio } from "./CombustibleComercio";
import { CombustibleConsumo } from "./CombustibleConsumo";
import { CombustibleFactura } from "./CombustibleFafctura";
import { CombustibleProducto } from "./CombustibleProducto";
import { CombustibleTarjeta } from "./CombustibleTarjeta";

export interface ImportacionConsumosRequest {
  tarjeta?: CombustibleTarjeta;
  producto?: CombustibleProducto;
  comercio?: CombustibleComercio;
  factura?: CombustibleFactura;
  consumo?: CombustibleConsumo;
}