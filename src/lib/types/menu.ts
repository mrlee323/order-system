export type AccessMode = "tablet" | "mobile" | "kiosk";

export type CategoryType = "all" | "beverages" | "food";

export interface OptionChoice {
  id: number;
  title: string;
  price: number;
  stock?: number;
  available?: boolean;
  maxQuantity?: number;
}

export interface OptionGroup {
  id: number;
  type: string;
  title: string;
  allowMultiple: boolean;
  required: boolean;
  default?: number;
  choices: OptionChoice[];
}

export interface MenuItem {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: CategoryType;
  subcategory: string;
  price?: number;
  options?: {
    required?: OptionGroup[];
    optional?: OptionGroup[];
    extras?: OptionGroup[];
  };
  available?: boolean;
  stock?: number;
}

export interface Subcategory {
  id: number;
  type: string;
  title: string;
  items: MenuItem[];
}

export interface Category {
  id: number;
  type: string;
  title: string;
  subcategories: Subcategory[];
}

export type MenuResponse = Category[];
