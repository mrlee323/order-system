export interface MenuOption {
  price: number;
  stock: number;
  available: boolean;
}

export interface Addition {
  id: number;
  title: string;
  price: number;
}

// 새로운 옵션 구조를 위한 타입들
export interface OptionChoice {
  id: string;
  title: string;
  price: number;
  stock?: number;
  available?: boolean;
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
  category: string; // beverages | food
  subcategory: string; // espresso | tea | sandwich | ...
  price?: number; // 푸드의 경우 단일 가격
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

// 장바구니 관련 타입
export interface SelectedOption {
  groupId: string;
  choiceId: string;
  choice: OptionChoice;
}

export interface CartItem {
  id: string; // 고유 ID (메뉴ID + 선택된옵션들)
  menuItem: MenuItem;
  selectedOptions: SelectedOption[];
  quantity: number;
  totalPrice: number;
}

export interface CartContextType {
  items: CartItem[];
  isModalOpen: boolean;
  addItem: (item: Omit<CartItem, "id" | "totalPrice">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openModal: () => void;
  closeModal: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
