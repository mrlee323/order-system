export type CategoryType = "all" | "beverages" | "food";

export interface OptionChoice {
  id: string;
  title: string;
  price: number;
  stock?: number;
  available?: boolean;
  maxQuantity?: number; // 최대 선택 가능한 수량
}

export interface OptionGroup {
  id: string;
  title: string;
  type: "single" | "multi";
  required: boolean;
  default?: string;
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
    additions?: OptionGroup[];
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

export interface MenuResponse {
  categories: Category[];
}
