export interface InputType { 
    value: string; 
    type: string; 
    setValue: (value: string) => void; 
    placeholder: string; 
    label: string; 
    isRequired?: boolean 
}