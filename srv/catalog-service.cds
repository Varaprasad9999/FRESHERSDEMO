using {DATA} from '../db/tables';

service MyService @(path: '/myservice') {

    entity Students as projection on DATA.Students;

    
    action   resetRollNoTo1(ID : UUID)                    returns Students;
    function getStudentsCountWithGivenName(name : String) returns String;

}
