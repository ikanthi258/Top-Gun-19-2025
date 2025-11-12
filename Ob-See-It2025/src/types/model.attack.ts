export interface AttackData {
    acceleration: number;
    distance: number;
    function: string;
    height: number;
    id: number;
    lat: number;
    long: number;
    status: string;
    velocity: number;
}

export interface ModelAttack {
    attacks : string[];
    filter : {
        Keyword : string;
        Column : string;
    };
    pagination: {
      Page: number;
      PerPage: number;
      Total: number;    
    }
}