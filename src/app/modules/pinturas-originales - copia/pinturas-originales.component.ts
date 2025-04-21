import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import PhotoSwipeLightbox from 'photoswipe/lightbox';

@Component({
  selector: 'app-pinturas-originales',
  templateUrl: './pinturas-originales.component.html',
  styleUrls: ['./pinturas-originales.component.css'],
})
export class PinturasOriginalesComponent implements OnInit, AfterViewInit, OnDestroy {
  pinturas: any[] = [];
  presentacionPintura: any = null;
  loading: boolean = true;
  lightbox: PhotoSwipeLightbox | undefined;
  currentPinturaImages: any[] = [];

  constructor(private firestoreService: FirestoreService) { }

  ngOnInit() {
    this.cargarPinturas();
    this.cargarPinturaDePresentacion();
    this.loading = false;
  }

  ngAfterViewInit() {
    this.lightbox = new PhotoSwipeLightbox({
      gallery: '.galeria-lateral',
      children: 'img.full-size-image', // Cambiado el selector
      pswpModule: () => import('photoswipe'),
    });


    this.lightbox.init();
  }

  ngOnDestroy() {
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }

  cargarPinturas() {
    this.firestoreService.getPinturas().subscribe({
      next: (response) => {
        this.pinturas = response;
        this.pinturas.forEach((pintura) => {
          this.firestoreService.getImagenes(pintura.id).subscribe((imagenes) => {
            pintura.imagenes = imagenes;
          });
        });
      },
      error: (error) => console.error('Error al obtener pinturas:', error),
    });
  }

  cargarPinturaDePresentacion() {
    this.firestoreService.getPortada().subscribe({
      next: (response) => {
        this.presentacionPintura = response[0];
      },
      error: (error) => {
        console.error('Error al obtener portada:', error);
      },
    });
  }

  openPhotoSwipe(pinturaIndex: number) {
    const selectedPintura = this.pinturas[pinturaIndex];
    this.currentPinturaImages = selectedPintura?.imagenes || [];

    if (this.lightbox && this.currentPinturaImages.length > 0) {
      const dataSource = this.currentPinturaImages.map((img) => {
        const image = new Image();
        image.src = img.url;
        return {
          src: img.url, // Usa la URL de la imagen
          width: image.width, // Usa el ancho original de la imagen
          height: image.height, // Usa la altura original de la imagen
        };
      });

      this.lightbox.loadAndOpen(0, dataSource);
    } else {
      console.warn('No hay imágenes para mostrar en esta pintura.');
    }
  }
}