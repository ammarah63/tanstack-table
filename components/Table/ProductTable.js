import React, { useState, useReducer, useEffect } from "react";
import {
  createColumnHelper,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("title", {
    cell: (info) => info.getValue(),
    footer: (info) => info.column.id,
    show: true, // Initially visible
    sortType: "basic", // Enable sorting for this column
  }),
  columnHelper.accessor((row) => row.category, {
    id: "Category",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Category</span>,
    footer: (info) => info.column.id,
    show: true, // Initially visible
    sortType: "basic", // Enable sorting for this column
  }),
  columnHelper.accessor("price", {
    header: () => "Price",
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
    show: true, // Initially visible
    sortType: "basic", // Enable sorting for this column
  }),
  columnHelper.accessor("discountPercentage", {
    header: () => <span>Discount Percentage</span>,
    footer: (info) => info.column.id,
    show: true, // Initially visible
    sortType: "basic", // Enable sorting for this column
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
    footer: (info) => info.column.id,
    show: true, // Initially visible
    sortType: "basic", // Enable sorting for this column
  }),
];

const ProductTable = ({ pdata, totalProducts }) => {
  const [data, setData] = useState(pdata);
  const router = useRouter();
  const { page } = router.query || {};
  const initialPage = page ? parseInt(page, 10) : 0;
  const [pagination, setPagination] = useState({
    pageIndex: initialPage,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [tableState, setTableState] = useState({
    columnVisibility: columns.reduce((acc, column) => {
      acc[column.id || column.accessor] = true;
      return acc;
    }, {}),
  });
  const rerender = useReducer(() => ({}), {})[1];
  const table = useReactTable({
    // autoResetPageIndex: false,
    manualPagination: true,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination,
      sorting: sorting,
      columnVisibility: columnVisibility,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  useEffect(() => {
    setData(pdata);
    console.log("newData", pdata);
  }, [pdata]);

  useEffect(() => {
    console.log(pagination.pageIndex);
  }, [pagination.pageIndex]);

  useEffect(() => {
    if (pagination.pageIndex !== 0) {
      router.push(
        `/?page=${pagination.pageIndex + 1}&pageSize=${pagination.pageSize}`,
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [pagination.pageIndex, pagination.pageSize]);
  return (
    <>
      <p className="text-center text-black text-2xl my-5 underline">
        TanStack Product Table React Table Library
      </p>
      <div className="flex justify-center">
        <div className="p-2">
          <div className="inline-block border border-black shadow rounded">
            <div className="px-1 border-b border-black">
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                  }}
                />{" "}
                Toggle All
              </label>
            </div>
            {table.getAllLeafColumns().map((column) => (
              <div key={column.id}>
                <label>
                  <input
                    {...{
                      type: "checkbox",
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />{" "}
                  {column.id}
                </label>
              </div>
            ))}
          </div>
          <div className="h-4" />
          <table>
            <thead className="border border-black">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr className="border border-black" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      className="border border-black px-4"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() || ""] ?? null}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                            <p
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              Sort
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="border border-black">
              {table.getRowModel().rows.map((row) => (
                <tr className="border border-black" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="border border-black px-4" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="border border-black">
              {table.getFooterGroups().map((footerGroup) => (
                <tr className="border border-black" key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th className="border border-black" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <div className="h-2" />
          <div className="flex items-center gap-2 ">
            <button
              className="border rounded p-1"
              onClick={() => {
                table.setPageIndex(0);
                console.log(table.getState().pagination.pageIndex);
              }}
              //disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => {
                const prevPageIndex = pagination.pageIndex - 1;
                table.setPageIndex(prevPageIndex);
                console.log(table.getState().pagination.pageIndex);
              }}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => {
                const nextPageIndex = pagination.pageIndex + 1;
                table.setPageIndex(nextPageIndex);
              }}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => {
                table.setPageIndex(
                  Math.ceil(totalProducts / pagination.pageSize)
                );
                console.log(table.getState().pagination.pageIndex);
              }}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex} of
                {Math.ceil(totalProducts / pagination.pageSize)}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{" "}
            {totalProducts} Rows
          </div>
          <div className="h-4" />
          <button onClick={() => rerender()} className="border p-2">
            Rerender
          </button>
        </div>
      </div>
    </>
  );
};

function Filter({ column, table }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          value={columnFilterValue ? columnFilterValue[0] : ""}
          onChange={(value) =>
            column.setFilterValue((old) => [value, old ? old[1] : undefined])
          }
          placeholder="Min"
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={columnFilterValue ? columnFilterValue[1] : ""}
          onChange={(value) =>
            column.setFilterValue((old) => [old ? old[0] : undefined, value])
          }
          placeholder="Max"
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder="Search..."
      type="text"
      value={columnFilterValue || ""}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default ProductTable;
