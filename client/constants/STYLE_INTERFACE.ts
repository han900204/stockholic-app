export interface ForumColumn {
  id: 'id' | 'name' | 'nick_name' | 'date_created';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface ForumData {
  id: number;
  name: string;
  nick_name: string;
  date_created: string;
}

export interface MultiSelectOption {
  value: string;
  label: string;
}
