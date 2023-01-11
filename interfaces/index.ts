// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  id: number
  name: string
};
export interface Login  {
  email: string,
  password : string
}
export interface Person {
  token : string,
  id : number
  group : string
}
export interface Message {
  created_by: string,
  content: string,
  created_at:Date,
  belongs_to:string,
  bodyFile: any,
  type:string


}
