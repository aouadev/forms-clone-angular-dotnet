import { extend } from 'lodash-es';
import { Form, formDetailed } from './form';
export class Instance {
    instanceId: number = 0;
    formId: number = 0;
    userId: number = 0;
    started?: Date;
    completed?: Date;
    

}



export class InstanceWithFormDetailed extends Instance {
    form? : formDetailed;

}