import {Component, Injector, EventEmitter} from '@angular/core';
import {DataService} from '../../services/DataService';
import {Response} from '@angular/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
export const ROWHEIGHT = 35;

@Component({
    selector: 'aml-picker',
    template: `
    <form [formGroup]="amlForm">
        <div class="row" *ngIf="index === 0">
            <div class="col-md-6"><b>Manufacturer</b></div>
            <div class="col-md-6"><b>Manufacturer PN</b></div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div [ngStyle]="inputStyle" (mouseleave)="onMouseLeaveMfgr()">
                    <input type="text" [formControl]="amlForm.controls['mfgrSearchtTerm']"
                           [ngModel]="manufacturer"
                           (blur)="mfgrInputBlurred = true"
                           (focus)="onMfgrFocus()"
                           class="form-control"/>
                    <div class="list-group" style="margin-left: 30px;">
                        <a *ngFor="let mfgr of mfgrs" (click)="setMfgr(mfgr)"
                            class="list-group-item list-group-item-action"
                            style="cursor: pointer;">{{mfgr}}</a>
                    </div>
                </div>
            </div>
            <div class="col-md-5">
                <div [ngStyle]="inputStyle" (mouseleave)="onMouseLeavePn()">
                    <input type="text" [formControl]="amlForm.controls['pnSearchtTerm']"
                           [ngModel]="partnumber"
                           (blur)="pnInputBlurred = true"
                           (focus)="onPnFocus()"
                           class="form-control"/>
                    <div class="list-group" style="margin-left: 30px;">
                        <a *ngFor="let pn of pns" (click)="setPn(pn)"
                            class="list-group-item list-group-item-action"
                            style="cursor: pointer;">{{pn}}</a>
                    </div>
                </div>
            </div>
            <div class="col-md-1">
                <div [ngStyle]="closeStyle" (click)="closeItem()">&times;</div>
            </div>
        </div>
    </form>`
})
export class AmpPicker {
    mfgrSearchtTerm: FormControl;
    pnSearchtTerm: FormControl;
    mfgrs: Array<string>;
    pns: Array<string>;
    manufacturer: string = '';
    partnumber: string = '';
    mfgrInputBlurred: boolean = true;
    pnInputBlurred: boolean = true;
    index: number = 0;
    top: string;
    zIndex: string;
    inputStyle: any;
    closeStyle: any;
    amlForm: any;
    closeEmitter = new EventEmitter();
    errorEmitter = new EventEmitter();

    constructor (
        private ds: DataService,
        private injector: Injector) {

        this.amlForm = new FormGroup({
            'mfgrSearchtTerm': new FormControl(''),
            'pnSearchtTerm': new FormControl('')
        });

        this.mfgrSearchtTerm = this.amlForm.controls['mfgrSearchtTerm'];
        this.pnSearchtTerm = this.amlForm.controls['pnSearchtTerm'];
        this.index = this.injector.get('index');
        this.top = this.index * ROWHEIGHT + 'px';
        this.zIndex = this.index * -1 + '';
        this.inputStyle = {
            'position': 'absolute',
            'top': this.top,
            'z-index': this.zIndex,
            'height': '34px',
            'width': '90%'
        };
        this.closeStyle = Object.assign({cursor: 'pointer'}, this.inputStyle);
        delete this.closeStyle['z-index'];
    }

    ngOnInit() {
        this.mfgrSearchtTerm.valueChanges
             .debounceTime(400)
             .distinctUntilChanged()
             .switchMap(() => {
                 this.manufacturer = this.mfgrSearchtTerm.value;
                 return this.queryMfgrDb();
             })
        .subscribe((resp: Array<string>) => {
                if (this.mfgrInputBlurred) {
                    this.mfgrs = [];
                    return;
                }
                if (this.pnSearchtTerm.value) {
                    this.mfgrs = this.getListFromAmpList(resp, (amp: string) : string => {
                        return amp.substr(0, amp.indexOf('|'));
                    });
                    this.mfgrs = this.mfgrs.sort();
                    return;
                }
                this.mfgrs = resp.sort();
            },
            (err: Response) => {
                this.errorEmitter.emit(err.json().payload.message);
            });

        this.pnSearchtTerm.valueChanges
             .debounceTime(400)
             .distinctUntilChanged()
             .switchMap(() => {
                 this.partnumber = this.pnSearchtTerm.value;
                 return this.queryPnDb();
             })
        .subscribe((resp: Array<string>) => {
                if (this.pnInputBlurred) {
                    this.pns = [];
                    return;
                }
                if (this.mfgrSearchtTerm.value) {
                    this.pns = this.getListFromAmpList(resp, (amp: string) : string => {
                        return amp.substr(amp.indexOf('|') + 1);
                    });
                    this.pns = this.pns.sort();
                    return;
                }
                this.pns = resp.sort();
            },
            (err: Response) => {
                this.errorEmitter.emit(err.json().payload.message);
            });
    }

    queryMfgrDb () {
        if (this.mfgrSearchtTerm.value) {
            if (this.pnSearchtTerm.value) {
                return this.ds.getSubset('amp-set', this.mfgrSearchtTerm.value + '*|' + this.pnSearchtTerm.value);
            } else {
                return this.ds.getSubset('mfgr-set', this.mfgrSearchtTerm.value + '*');
            }
        } else {
            return Observable.interval(1).map(() => new Array());
        }
    }

    queryPnDb () {
        if (this.pnSearchtTerm.value) {
            if (this.mfgrSearchtTerm.value) {
                return this.ds.getSubset('amp-set', this.mfgrSearchtTerm.value + '|' + this.pnSearchtTerm.value + '*');
            } else {
                return this.ds.getSubset('mpn-set', this.pnSearchtTerm.value + '*');
            }
        } else {
            return Observable.interval(1).map(() => new Array());
        }
    }

    setMfgr (mfgr: string) {
        this.mfgrs = [];
        this.manufacturer = mfgr;
    }

    onMfgrFocus() {
        this.mfgrInputBlurred = false;
        if (this.mfgrSearchtTerm.value) {
            this.queryMfgrDb().subscribe((resp: Array<string>) => {
                if (this.pnSearchtTerm.value) {
                    this.mfgrs = this.getListFromAmpList(resp, (amp: string) : string => {
                        return amp.substr(0, amp.indexOf('|'));
                    });
                    this.mfgrs = this.mfgrs.sort();
                    return;
                }
                this.mfgrs = resp.sort();
            },
            (err: Response) => {
                this.errorEmitter.emit(err.json().payload.message);
            });
        }
    }

    onMouseLeaveMfgr () {
        if (this.mfgrInputBlurred) {return; }
        if (this.mfgrSearchtTerm.value) {
            let searchTerm = this.mfgrSearchtTerm.value;
            let searchSet = 'mfgr-set';
            if (this.pnSearchtTerm.value) {
                searchSet = 'amp-set';
                searchTerm = this.mfgrSearchtTerm.value + '|' + this.pnSearchtTerm.value;
            }
            this.ds.getExists(searchSet, searchTerm)
                .subscribe((exists: boolean) => {
                    if (!exists) {
                        this.manufacturer = '';
                    }
                },
                (err: Response) => {
                    this.errorEmitter.emit(err.json().payload.message);
                });
        }
        this.mfgrs = [];
    }

    setPn (pn: string) {
        this.pns = [];
        this.partnumber = pn;
    }

    onPnFocus() {
        this.pnInputBlurred = false;
        if (this.pnSearchtTerm.value) {
            this.queryPnDb().subscribe((resp: Array<string>) => {
                if (this.mfgrSearchtTerm.value) {
                    this.pns = this.getListFromAmpList(resp, (amp: string) : string => {
                        return amp.substr(amp.indexOf('|') + 1);
                    });
                    this.pns = this.pns.sort();
                    return;
                }
                this.pns = resp.sort();
            },
            (err: Response) => {
                this.errorEmitter.emit(err.json().payload.message);
            });
        }
    }

    onMouseLeavePn () {
        if (this.pnInputBlurred) {return; }
        if (this.pnSearchtTerm.value) {
            let searchTerm = this.pnSearchtTerm.value;
            let searchSet = 'mpn-set';
            if (this.mfgrSearchtTerm.value) {
                searchSet = 'amp-set';
                searchTerm = this.mfgrSearchtTerm.value + '|' + this.pnSearchtTerm.value;
            }
            this.ds.getExists(searchSet, searchTerm)
                .subscribe((exists: boolean) => {
                    if (!exists) {
                        this.partnumber = '';
                    }
                },
                (err: Response) => {
                    this.errorEmitter.emit(err.json().payload.message);
                });
        }
        this.pns = [];
    }

    getListFromAmpList(resp: string[], fn: (n: string) => string): string[] {
        let list = resp.map((amp) => {
            return fn(amp);
        });
        return list;
    }

    closeItem () {
        this.closeEmitter.emit(this.index);
    }
}
