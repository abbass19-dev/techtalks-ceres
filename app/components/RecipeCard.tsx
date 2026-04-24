type Props = {
  recipe: any;
};

export default function RecipeCard({ recipe }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
      
      {/* Image */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-4">
        <h2 className="font-semibold text-gray-800 mb-1">
          {recipe.name}
        </h2>

        <p className="text-sm text-gray-500 mb-3">
          Healthy and delicious meal
        </p>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>{recipe.calories} kcal</span>
          <span>{recipe.protein || 20}g protein</span>
        </div>

        {/* Button */}
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          View Details
        </button>
      </div>
    </div>
  );
}