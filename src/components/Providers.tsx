'use client';

import { CartProvider } from '../context/CartContext';
import { ProductsProvider } from '../context/ProductsContext';
import { TicketsProvider } from '../context/TicketsContext';
import { OrdersProvider } from '../context/OrdersContext';
import { CategoriesProvider } from '../context/CategoriesContext';
import { CRMProvider } from '../context/CRMContext';
import { PromoProvider } from '../context/PromoContext';
import { BlogProvider } from '../context/BlogContext';
import SupportWidget from './SupportWidget';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BlogProvider>
      <OrdersProvider>
        <CRMProvider>
          <TicketsProvider>
            <CategoriesProvider>
              <ProductsProvider>
                <PromoProvider>
                  <CartProvider>
                    {children}
                    <SupportWidget />
                  </CartProvider>
                </PromoProvider>
              </ProductsProvider>
            </CategoriesProvider>
          </TicketsProvider>
        </CRMProvider>
      </OrdersProvider>
    </BlogProvider>
  );
}
