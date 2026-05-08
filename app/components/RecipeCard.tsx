import Image from "next/image";

type Props = {
  recipe: {
    image?: string;
    name: string;
    calories: number;
    protein?: number;
  };
};

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-40 w-full">
        <Image
          src={recipe.image || "/images/recipe-placeholder.jpg"}
          alt={recipe.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="mb-1 font-semibold text-gray-800">{recipe.name}</h2>

        <p className="mb-3 text-sm text-gray-500">Healthy and delicious meal</p>

        <div className="mb-4 flex justify-between text-sm text-gray-600">
          <span>{recipe.calories} kcal</span>
          <span>{recipe.protein || 20}g protein</span>
        </div>

        <button className="w-full rounded-lg bg-green-600 py-2 text-white transition hover:bg-green-700">
          View Details
        </button>
      </div>
    </div>
  );
}
