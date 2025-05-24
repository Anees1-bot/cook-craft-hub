
import { Clock, Users, Star } from 'lucide-react';
import { Recipe } from '@/services/recipeApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onClick={onClick}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              {recipe.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4" onClick={onClick}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{recipe.cuisine}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{recipe.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {recipe.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{recipe.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
