import React, { useState } from "react";
import BasicTable from "./BasicTable";
import ProductTable from "./ProductTable";

const ReactTable = ({ data, totalProducts }) => {
  return (
    <>
      <p className="text-center text-black text-2xl my-5 underline">
        TanStack React Table Library
      </p>
      <ProductTable pdata={data.products} totalProducts={totalProducts} />
      <BasicTable />
    </>
  );
};

export default ReactTable;
