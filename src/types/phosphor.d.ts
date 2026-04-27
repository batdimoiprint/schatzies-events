declare module '@phosphor-icons/react' {
  import { FC, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
    mirrored?: boolean;
  }

  export type Icon = FC<IconProps>;

  export const PlusCircle: Icon;
  export const CheckCircle: Icon;
  export const ChartBar: Icon;
  export const Download: Icon;
  export const Link: Icon;
  export const MagnifyingGlass: Icon;
  export const Funnel: Icon;
  // Add other icons as needed, or use a wildcard if preferred
}
