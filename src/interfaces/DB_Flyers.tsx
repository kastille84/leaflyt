export interface DB_Flyer_Create {
  title: string;
  category: string;
  subcategory: string;
  content: string;
  tags?: string[];
}

export interface DB_Flyer_Create_Unregistered extends DB_Flyer_Create {
  typeOfUser: string;
}
