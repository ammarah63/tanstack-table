import { useEffect } from "react";
import { ReactTable } from "../components";

export default function Home(props) {
  const { products } = props.data;

  useEffect(() => {
    console.log(props.data);
  }, [props.data]);
  return (
    <>
      <ReactTable data={props.data} totalProducts={props.totalProducts} />
    </>
  );
}
export async function getServerSideProps({ query }) {
  if (query.page) {
    console.log("context", query.page);
    const skip = (parseInt(query.page) - 1) * query.pageSize;
    console.log("skip", skip);

    const res = await fetch(
      `https://dummyjson.com/products?limit=${query.pageSize}&skip=${skip}`
    );
    const data = await res.json();
    //console.log("data", data);
    const totalProducts = data.total;
    //console.log("totalProducts", totalProducts);
    return {
      props: {
        data,
        totalProducts,
      },
    };
  }
  const res = await fetch("https://dummyjson.com/products?limit=12");
  const data = await res.json();

  const totalProducts = data.total;
  return {
    props: {
      data,
      totalProducts,
    },
  };
}
