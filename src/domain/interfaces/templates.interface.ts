

export interface ColumnsInterface {
    name: string;
    columns: { [columnName: string]: ColumnConfig };
    relations?: { [relationName: string]: RelationConfig };
  }
  
 interface ColumnConfig {
    type: string;
    primary?: boolean;
    generated?: boolean;
  }
  
export  interface RelationConfig {
    type: string;
    target: string;
  }