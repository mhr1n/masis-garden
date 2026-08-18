import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import '../globals.css';
import './admin.css';
import { ProductsProvider } from '../../context/ProductsContext';
import { TicketsProvider } from '../../context/TicketsContext';
import { OrdersProvider } from '../../context/OrdersContext';
import { CRMProvider } from '../../context/CRMContext';
import { CategoriesProvider } from '../../context/CategoriesContext';
import AdminAuth from '../../components/admin/AdminAuth';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = { title: 'Admin — Ariel Green Plants' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <OrdersProvider>
          <CRMProvider>
            <TicketsProvider>
              <CategoriesProvider>
                <ProductsProvider>
                  <AdminAuth>
                    {children}
                  </AdminAuth>
                </ProductsProvider>
              </CategoriesProvider>
            </TicketsProvider>
          </CRMProvider>
        </OrdersProvider>
      </body>
    </html>
  );
}
