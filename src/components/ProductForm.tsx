import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ProductToInsert } from "@app/types";

export function ProductForm() {
  const [product, setProduct] = useState<ProductToInsert>({
    name: "",
    description: "",
    price: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async (id: string | string[]) => {
      try {
        const { data } = await axios.get("/api/products/" + id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (router.query?.id) {
      fetchProduct(router.query.id);
    }
  }, [router.query.id]);

  const handleChange = (event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.target
    setProduct({ ...product, [name]: value })
};

  const handleSubmit = async (e:React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (router.query?.id) {
        await axios.put("/api/products/" + router.query.id, {
          id: router.query.id,
          name: product.name,
          description: product.description,
          price: product.price,
        });
        toast.success("Producto actualizado", {
          position: "bottom-center",
        });
      } else {
        await axios.post("/api/products", product);
        toast.success("Producto creado", {
          position: "bottom-center",
        });
      }

      router.push("/");
    } catch (error) {
      if(axios.isAxiosError(error)){
        toast.error(error.response?.data.message);
      }
    }
  };

  return (
    <div className="w-full max-w-xs">
      <form
        className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            htmlFor="name"
          >
            Nombre:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
            type="text"
            placeholder="Ingresa un nombre"
            id="name"
            name="name"
            onChange={handleChange}
            value={product.name}
            autoComplete="off"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 dark:text-white font-bold mb-2 text-sm"
          >
            Precio:
          </label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
            name="price"
            placeholder="14.000"
            onChange={handleChange}
            value={product.price}
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-white font-bold mb-2 text-sm"
          >
            Escribe una descripción
          </label>
          <textarea
            name="description"
            id="description"
            rows={2}
            placeholder="Ingresa una descripción"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:border-slate-900 dark:text-white"
            onChange={handleChange}
            value={product.description}
          ></textarea>
        </div>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {router.query?.id ? "Actualizar Producto" : "Guardar Producto"}
        </button>
      </form>
    </div>
  );
}
