declare module 'xlsx' {
  export const utils: any;
  export function readFile(filename: string, opts?: any): any;
  export function read(data: any, opts?: any): any;
  export function write(data: any, opts?: any): any;
  export function writeFile(data: any, filename: string, opts?: any): any;
}
