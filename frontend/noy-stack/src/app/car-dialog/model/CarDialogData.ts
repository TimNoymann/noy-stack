import {CarDto} from '../../core/modules/openapi';

export interface CarDialogData {
  mode: 'create' | 'edit';
  id?: string;
  car?: CarDto;
}
