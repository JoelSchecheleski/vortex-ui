export type GalleryBadge = 'AI' | 'New' | 'Upd';

export interface GalleryCode {
  html: string;
  ts: string;
}

export interface GalleryDemo {
  id: string;
  title: string;
  badge?: GalleryBadge;
  description: string;
  code: GalleryCode;
}

/** Componente expansível (▶) dentro da categoria. */
export interface GalleryComponent {
  id: string;
  title: string;
  badge?: GalleryBadge;
  demos: GalleryDemo[];
}

export interface GalleryCategory {
  id: string;
  title: string;
  components: GalleryComponent[];
}

export interface GalleryActive {
  category: GalleryCategory;
  component: GalleryComponent;
  demo: GalleryDemo;
}
