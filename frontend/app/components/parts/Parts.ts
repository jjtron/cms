import {Component, Inject, ViewChild, ViewContainerRef, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import {Store, AppStore, AppState} from '../../redux_barrel';
import {Response} from '@angular/http';
import {Base} from '../Base';
import {BASEPATH} from '../dashboard/config';
import {Router} from '@angular/router';
import {DataService} from '../../services/DataService';
import {Part} from '../../models/Part';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import {AmpPicker} from '../aml/AmpPicker';
import {ROWHEIGHT} from '../aml/AmpPicker';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'parts-component',
  entryComponents: [AmpPicker],
  template: `
    <div class="col-md-8 col-md-offset-2">
        <div class="row">
            <div class="col-md-4" (mouseleave)="onMouseLeavePartName()">
                <label for="partname">Part Name {{partExists}}</label>
                <input [formControl]="partNameSearchTerm"
                       id="partname" type="text"
                       [(ngModel)]="partname"
                       (focus)="onPartNameFocus()"
                       (blur)="partNameInputBlurred = true"
                       class="form-control"/>
                <div class="list-group" style="margin-left: 30px;">
                    <a *ngFor="let prtname of partnames" (click)="setPartName(prtname)"
                        class="list-group-item list-group-item-action"
                        style="cursor: pointer;">{{prtname}}</a>
                </div>
            </div>
            <div class="col-md-8">
                <label for="description">Description</label>
                <input id="description" type="text" [(ngModel)]="description" class="form-control"/>
            </div>
        </div>
        <div class="row" style="position: absolute; top: 60px; width: 100%; z-index: -1;">
            <div class="col-md-4 text-right" style="padding-top: 20px;">
                <button (click)="createAmp()" class="btn">Add AMP</button>
            </div>
            <div class="col-md-8">
                <div #dynamicComponentContainer></div>
            </div>
        </div>
        <div class="row" [ngStyle]="submitButtonStyle">
            <div class="col-md-4 text-right">
                <button *ngIf="!partExists && partname" (click)="add()" class="btn">Submit</button>
                <button *ngIf="partExists && partname" (click)="update()" class="btn">Update</button>
                <div style="color: blue;">{{requestStatus}}</div>
                <div style="color: red;">{{amlError}}</div>
            </div>
        </div>
    </div>`
})

export class Parts extends Base {
    partNameSearchTerm: FormControl;
    partNameInputBlurred: boolean = true;
    partExists: boolean = false;
    part: Part = {
        id: null,
        partname: null,
        description: 'desc',
        aml: []
    };
    partname: string = '';
    partnames: Array<string> = [];
    description: string = '';
    factory: any;
    ampArray: AmpPicker[] = [];
    requestStatus: string;
    amlError: string;
    submitVerticalOffset: number = 90;
    submitButtonStyle: any = {position: 'absolute', top: this.submitVerticalOffset + ROWHEIGHT + 'px', width: '100%', 'z-index': -100};

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) dynamicComponentContainer: ViewContainerRef;

    constructor (
        @Inject(AppStore) protected store: Store<AppState>,
        @Inject(BASEPATH) protected basepath: string,
        protected router: Router,
        private ds: DataService,
        private cfr: ComponentFactoryResolver) {
            super(store, basepath, 'parts', router);
            this.partNameSearchTerm = new FormControl();
    }

    ngOnInit () {
        this.partNameSearchTerm.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(() => {
                this.partname = this.partNameSearchTerm.value;
                return this.queryPartNameDb();
             })
        .subscribe((resp: Array<string>) => {
                if (this.partNameInputBlurred) {
                    this.partnames = [];
                    this.partExists = true;
                    return;
                }
                this.partnames = resp.sort();
                this.partExists = (this.partnames.length === 0) ? false : true;
            },
            (err: Response) => {
                this.showRequestStatus(err.json().payload.message);
            });
        this.factory = this.cfr.resolveComponentFactory(AmpPicker);
    }

    queryPartNameDb () {
        if (this.partNameSearchTerm.value) {
            return this.ds.getSubset('partname-set', this.partNameSearchTerm.value + '*');
        } else {
            return Observable.interval(1).take(1).map(() => new Array());
        }
    }

    add () {
        if (this.checkPartValidity()) {
            this.ds.postPart(this.part).subscribe(
                (resp: Response) => {
                    this.showRequestStatus('part created');
                    this.partExists = true;
                },
                (err: Response) => {
                    this.showRequestStatus(err.json().payload.message);
                });
        }
    }

    update () {
        if (this.checkPartValidity()) {
            this.ds.putPart(this.part).subscribe(
                (resp: Response) => {
                    this.showRequestStatus('part updated');
                },
                (err: Response) => {
                    this.showRequestStatus(err.json().payload.message);
                });
        }
    }

    checkPartValidity () {
        let isIncompleteAml = false;
        if (!this.partname || !this.description) {
            this.showRequestStatus('No description and/or part name');
            return false;
        }
        this.part.aml = [];
        this.ampArray.forEach((amp: AmpPicker) => {
            if (!amp.manufacturer || !amp.partnumber) {
                isIncompleteAml = true;
            }
            if (this.part.aml.indexOf(amp.manufacturer + '|' + amp.partnumber) !== -1) {
                isIncompleteAml = true;
            }
            this.part.aml.push(amp.manufacturer + '|' + amp.partnumber);
        });
        if (isIncompleteAml) {
            this.showRequestStatus('Incomplete and/or duplicate AML data');
            return false;
        }
        this.part.partname = this.partname;
        this.part.description = this.description;
        return true;
    }

    createAmp (amp?: string) {
        let count = this.ampArray.length;
        let resolvedInputs = ReflectiveInjector.resolve([
            {provide: 'index', useValue: count}
        ]);
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicComponentContainer.parentInjector);
        let component = this.factory.create(injector);
        this.dynamicComponentContainer.insert(component.hostView);
        this.ampArray.push(component.instance);
        this.submitButtonStyle.top = this.submitVerticalOffset + ROWHEIGHT * (count + 1) + 'px';
        component.instance.closeEmitter.subscribe((i: number) => {
            this.ampArray.splice(i, 1);
            let j = 0;
            this.ampArray.forEach((ampInstance) => {
                ampInstance.index = j;
                ampInstance.inputStyle.top = j * ROWHEIGHT + 'px';
                ampInstance.inputStyle.zIndex = j * -1 + '';
                ampInstance.closeStyle = Object.assign({cursor: 'pointer'}, ampInstance.inputStyle);
                delete ampInstance.closeStyle['z-index'];
                j++;
            });
            this.dynamicComponentContainer.remove(i);
            let f: number = (this.ampArray.length === 0) ? 1 : this.ampArray.length;
            this.submitButtonStyle.top = this.submitVerticalOffset + ROWHEIGHT * f + 'px';
        });
        component.instance.errorEmitter.subscribe((err: string) => {
            this.amlError = 'AML error: ' + err;
            setTimeout(() => {
                this.amlError = '';
            }, 1000);
        });
        if (amp) {
            component.instance.manufacturer = amp.split('|')[0];
            component.instance.partnumber = amp.split('|')[1];
        }
    }

    onPartNameFocus() {
        this.partNameInputBlurred = false;
        if (this.partNameSearchTerm.value) {
            this.queryPartNameDb().subscribe((resp: Array<string>) => {
                this.partnames = resp.sort();
            },
            (err: Response) => {
                this.showRequestStatus(err.json().payload.message);
            });
        }
    }

    setPartName (prtname: string) {
        this.clearAmpList();
        this.partname = prtname;
        this.getPart(prtname);
    }

    onMouseLeavePartName () {
        if (this.partNameInputBlurred) {return; }
        this.clearAmpList();
        if (this.partNameSearchTerm.value) {
            this.ds.getExists('partname-set', this.partNameSearchTerm.value)
                .subscribe((exists: boolean) => {
                    this.partExists = (exists) ? true : false;
                    if (exists) {
                        this.getPart(this.partNameSearchTerm.value);
                    }
                },
                (err: Response) => {
                    this.showRequestStatus(err.json().payload.message);
                });
        }
        this.partnames = [];
    }

    clearAmpList () {
        this.dynamicComponentContainer.clear();
        this.ampArray = [];
        this.partnames = [];
        this.description = '';
    }

    getPart (partname: string) {
        this.ds.getPart(partname).subscribe((resp) => {
            resp.aml.split('$').forEach((amp: string) => {
                if (amp) { this.createAmp (amp); }
            });
            this.description = resp.description;
        },
        (err: Response) => {
            this.showRequestStatus(err.json().payload.message);
        });
    }

    showRequestStatus (msg: string) {
        this.requestStatus = msg;
        setTimeout(() => {
            this.requestStatus = '';
        }, 1000);
    }
}
