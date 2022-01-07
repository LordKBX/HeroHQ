import { ApplicationModule, Component, OnInit, ViewEncapsulation, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DataConnectorService } from '../services/data-connector.service';
import { Router } from '@angular/router';

import Cropper from 'cropperjs';

var cropper: Cropper = null;

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NewheroComponent),
    multi: true
};

@Component({
    selector: 'app-newhero',
    templateUrl: './newhero.component.html',
    styleUrls: ['./newhero.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NewheroComponent implements OnInit {
    private slideValGlobal: number = 0.5;
    hero;

    constructor(private router: Router, private serviceData: DataConnectorService) {
        this.hero = {
            nom: "",
            age: 18,
            power: "",
            mantra: ""
        };
    }

    public cropImgFunc(event) {
        let result = document.querySelector('#inputImg'),
            imgPreview: HTMLImageElement = document.querySelector('#imgPreview');

        if (event.target.files.length) {
            // start file reader
            try {
                document.getElementById('previewAvatar').setAttribute('style', 'display:block');
                const reader = new FileReader();
                reader.onload = function (event2) {
                    //if (typeof event != 'ProgressEvent<FileReader>') { return; }
                    if (event2.loaded == event2.total) {
                        // create new image
                        var img: HTMLImageElement = document.createElement('img');
                        img.id = 'image';
                        img.src = (event2.target as any).result.toString();
                        img.style.maxWidth = "600px";
                        img.style.maxHeight = "600px";
                        // clean result before
                        result.innerHTML = '';
                        // append new image
                        result.appendChild(img);
                        // init cropper
                        cropper = new Cropper(img, {
                            viewMode: 1,
                            dragMode: 'move',
                            aspectRatio: 1,
                            autoCropArea: 0.68,
                            minContainerWidth: img.width,
                            minContainerHeight: img.height,
                            center: true,
                            zoomOnWheel: false,
                            zoomOnTouch: false,
                            cropBoxMovable: false,
                            cropBoxResizable: false,
                            guides: false,
                            ready: function (event) {
                                this.cropper = cropper;
                            },
                            crop: function (event) {
                                let imgSrc = cropper.getCroppedCanvas({
                                    width: 200,
                                    height: 200// input value
                                }).toDataURL("image/png");
                                imgPreview.src = imgSrc;
                            }
                        });
                    }
                };
                reader.readAsDataURL(event.target.files[0]);
                this.initSlideBar();
                this.resetSlideBar();
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    resetSlideBar() {
        this.slideValGlobal = 1;
        ($('#slider') as any).slider("value", this.slideValGlobal);
    }

    initSlideBar() {
        try {
            let zoomRatio = 0;
            ($('#slider') as any).slider({
                range: "min",
                min: 0,
                max: 2,
                step: 0.1,
                slide: function (event, ui) {
                    let slideVal = ui.value;
                    let zoomRatio = Math.round((slideVal - this.slideValGlobal) * 10) / 10;
                    this.slideValGlobal = slideVal;
                    cropper.zoom(zoomRatio);
                }
            });
        }
        catch (err) { console.error(err); }
    };

    hidePreview() {
        document.getElementById('previewAvatar').setAttribute('style', 'display:none');
    }

    save() {
        var Photo = (document.getElementById('imgPreview') as HTMLImageElement).src.replace('assets/images/', '');
        this.serviceData.register({ Nom: this.hero.nom, Age: this.hero.age, Pouvoir: this.hero.power, Citation: this.hero.mantra, Photo: Photo })
            .then(data => { if (data !== 0) this.router.navigate(['hero/'+data]); });

        //this.router.navigate(['home']);
    }

    ngOnInit() {
    }

}
