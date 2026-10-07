import {ListControl} from "./ListControl.js";
import {DomHelper} from "../../util/DomHelper.js";

/** @namespace Dropdown */
export class Dropdown extends ListControl {

    /**
     * Creates a dropdown list control for binding datasources to datasets.
     * This control is a specialized version of ListControl for dropdown functionality.
     *
     * @constructs
     * @extends {Banana.Controls.ListControl}
     */
    constructor(...args) {
        super(...args);
        console.log("Dropdown control created");
    }

    init() {
        super.init();
        this.bind("dataSourceChanged",()=>{
            this.createOptions();
        });
        this.bind('change', ()=>{
            this.setData(DomHelper.getData(this), false, true);
        });
    }

    setData (data, ignoreEvent = false, triggerChange = true) {
        super.setData(data, ignoreEvent, triggerChange);
        this.createOptions();
    }

    createOptions(){
        //loop over datasource
        let options = "";
        if (!this.datasource) return;

        console.log("create opiotns",this.datasource,this.getData())
        this.clear();
        this.datasource.forEach((item) => {
            //create option element
            if (item[this.dataKeyField] == null){
                //options += "<option disabled value='" + item[this.dataKeyField] + "'></option>";
               return;
            }
            if (this.getData() != -1 && this.getData() == item[this.dataKeyField]){
                options += "<option selected value='" + item[this.dataKeyField] + "'>" +this.preOptionsText+" "+ item[this.dataValueField] + " "+this.postOptionsText+"</option>";
            }
            else {
                options += "<option value='" + item[this.dataKeyField] + "'>" + item[this.dataValueField] + "</option>";
            }
        });
        this.addControl(options);
        this.invalidateDisplay();
    }

    setDataSource(datasource, ignoreEvent = false) {
        return super.setDataSource(datasource, ignoreEvent);
    }

    getTagName() {
        return "select";
    }



}