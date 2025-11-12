export interface ModelCamera {
  id: string;
  institute: string;
  location: string;
  name: string;
  token: string;
}

export interface ModelDetect {
  camera: ModelCamera;
  camera_id: string;
  id: number;
  path: string;
}

export interface Camera {
  camera: string[];
  pagination: {
    Page: number;
    PerPage: number;
    Total: number;
  };
  search: {
    keywoed: string;
    column: string;
  };
}
