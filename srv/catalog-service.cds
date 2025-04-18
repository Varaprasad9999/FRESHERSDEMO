using {DATA} from '../db/tables';

service MyService @(path: '/myservice'){

    entity Students as projection on DATA.Students;

}