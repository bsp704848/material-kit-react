// src/app/dashboard/products/page.tsx
"use client"

import React, { useState } from 'react';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { ProductsFilters } from '@/components/dashboard/products/products-filter';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <ProductsFilters searchTerm={searchTerm} onSearch={setSearchTerm} />
      <br />
      <LatestProducts searchTerm={searchTerm} />
    </div>
  );
}
