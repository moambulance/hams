export interface NavigationProperties { 
    id: number;
    name: string; 
    routerLink?: string; 
    icon: string;
    displayLabel: string;
    hasSubMenu?: boolean;
    active?:boolean;
    read: boolean;
    write?: boolean;
    children?: Array<{
        id: number,
        name: string, 
        routerLink: string, 
        icon: string,
        displayLabel: string 
    }>;
};