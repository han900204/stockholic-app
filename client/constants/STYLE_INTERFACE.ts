export interface ForumColumn {
  id: 'name' | 'nick_name' | 'date_created';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

export interface ForumData {
  name: string;
  nick_name: string;
  date_created: string;
}
