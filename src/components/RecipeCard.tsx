
import { Clock, Users, Star } from 'lucide-react';
import { Recipe } from '@/services/recipeApi';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-4 h-4">
            <Star className="w-4 h-4 text-gray-300 absolute" />
            <Star 
              className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <Card className="card-hover cursor-pointer overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 group animate-fade-in">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden">
            <img 
              src={recipe.image} 
              alt={recipe.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onClick={onClick}
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-gray-800 backdrop-blur-sm shadow-sm border-white/20"
            >
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
              {renderStars(recipe.rating)}
              <span className="text-white text-xs font-medium ml-1">
                {recipe.rating}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5" onClick={onClick}>
        <div className="space-y-3">
          <h3 className="font-poppins font-semibold text-lg leading-tight line-clamp-2 text-card-foreground group-hover:text-primary transition-colors duration-200">
            {recipe.name}
          </h3>
          
          <p className="text-sm text-muted-foreground font-medium">
            {recipe.cuisine}
          </p>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">{recipe.servings}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs font-medium border-primary/20 text-primary/80 hover:bg-primary/10 transition-colors duration-200"
              >
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs font-medium border-muted text-muted-foreground"
              >
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
