import Image from "next/image";
import { Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
function CardItem({ recipe }: { recipe: any }) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm" onClick={() => router.push(`/recipe/${recipe.id}`)}>
      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          className="object-cover"
        />
        <div className="absolute text-[#301400] top-2 left-2 bg-[#FFDCC5] px-3 py-1 rounded-full ">
          {recipe.time}
        </div>
        <button className="absolute top-2 right-2 bg-white rounded-full p-2">
          <Heart className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-black">{recipe.title}</h3>
        <h4 className="text-sm text-gray-600">{recipe.kcal} kcal</h4>
        <div className="flex gap-3 mt-4">
          <p className="text-sm text-gray-600 font-medium bg-[#E6EEFF] px-2 py-1 rounded-lg">{recipe.fat}g fat</p>
          <p className="text-sm text-gray-600 font-medium bg-[#E6EEFF] px-2 py-1 rounded-lg">{recipe.carbs}g carbs</p>
          <p className="text-sm text-gray-600 font-medium bg-[#E6EEFF] px-2 py-1 rounded-lg">{recipe.protein}g protein</p>
        </div>
        <p className="text-sm text-gray-600 font-medium mt-3"> <Clock className="inline-block mr-1" size={16} />{recipe.minutes} mins</p>

      </div>
    </div>
  );
}

export default CardItem;
