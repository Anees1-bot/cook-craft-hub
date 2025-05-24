
import { Clock, Users, Star, ChefHat, Utensils } from 'lucide-react';
import { Recipe } from '@/services/recipeApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
}

const RecipeDetailModal = ({ recipe, isOpen, onClose, onEdit }: RecipeDetailModalProps) => {
  if (!recipe) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{recipe.name}</span>
            <Button onClick={() => onEdit(recipe)} variant="outline" size="sm">
              Edit Recipe
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6">
            {/* Image and basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Total Time</p>
                      <p className="font-semibold">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-500">Servings</p>
                      <p className="font-semibold">{recipe.servings}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className="font-semibold">{recipe.rating} ({recipe.reviewCount})</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-500">Calories</p>
                      <p className="font-semibold">{recipe.caloriesPerServing} per serving</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Cuisine & Difficulty</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{recipe.cuisine}</Badge>
                    <Badge variant="outline">{recipe.difficulty}</Badge>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-2">Meal Types</p>
                  <div className="flex flex-wrap gap-1">
                    {recipe.mealType.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Ingredients */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Instructions */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetailModal;
