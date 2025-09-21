import { MenuItem } from "./menu";

import { OptionChoice } from "./menu";

export interface Addition {
  id: number;
  title: string;
  price: number;
}

export interface SelectedOption {
  groupId: number;
  choiceId: number;
  quantity: number;
  choice: OptionChoice;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  selectedOptions: SelectedOption[];
  quantity: number;
  totalPrice: number;
}
