
import { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Recipe } from '@/services/recipeApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';

interface RecipeFormProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id'> | (Recipe & { id: number })) => void;
}

const RecipeForm = ({ recipe, isOpen, onClose, onSave }: RecipeFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [''],
    instructions: [''],
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: 'Easy',
    cuisine: '',
    caloriesPerServing: 0,
    tags: [''],
    image: '',
    rating: 5,
    reviewCount: 0,
    mealType: [''],
    userId: 1
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
        caloriesPerServing: recipe.caloriesPerServing,
        tags: recipe.tags,
        image: recipe.image,
        rating: recipe.rating,
        reviewCount: recipe.reviewCount,
        mealType: recipe.mealType,
        userId: recipe.userId
      });
    } else {
      // Reset form for new recipe
      setFormData({
        name: '',
        ingredients: [''],
        instructions: [''],
        prepTimeMinutes: 0,
        cookTimeMinutes: 0,
        servings: 1,
        difficulty: 'Easy',
        cuisine: '',
        caloriesPerServing: 0,
        tags: [''],
        image: '',
        rating: 5,
        reviewCount: 0,
        mealType: [''],
        userId: 1
      });
    }
  }, [recipe, isOpen]);

  const handleArrayAdd = (field: 'ingredients' | 'instructions' | 'tags' | 'mealType') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const handleArrayRemove = (field: 'ingredients' | 'instructions' | 'tags' | 'mealType', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleArrayChange = (field: 'ingredients' | 'instructions' | 'tags' | 'mealType', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      ingredients: formData.ingredients.filter(item => item.trim() !== ''),
      instructions: formData.instructions.filter(item => item.trim() !== ''),
      tags: formData.tags.filter(item => item.trim() !== ''),
      mealType: formData.mealType.filter(item => item.trim() !== '')
    };

    if (recipe) {
      onSave({ ...cleanedData, id: recipe.id });
    } else {
      onSave(cleanedData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            {recipe ? 'Edit Recipe' : 'Create New Recipe'}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Basic Information */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Recipe Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cuisine">Cuisine *</Label>
                    <Input
                      id="cuisine"
                      value={formData.cuisine}
                      onChange={(e) => setFormData(prev => ({ ...prev, cuisine: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="prepTime">Prep Time (min)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={formData.prepTimeMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, prepTimeMinutes: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cookTime">Cook Time (min)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      value={formData.cookTimeMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, cookTimeMinutes: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={formData.servings}
                      onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="calories">Calories per serving</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.caloriesPerServing}
                      onChange={(e) => setFormData(prev => ({ ...prev, caloriesPerServing: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Ingredients</h3>
                  <Button type="button" onClick={() => handleArrayAdd('ingredients')} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={ingredient}
                      onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                      placeholder="e.g., 2 cups flour"
                      className="flex-1"
                    />
                    {formData.ingredients.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleArrayRemove('ingredients', index)}
                        size="sm"
                        variant="outline"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Instructions</h3>
                  <Button type="button" onClick={() => handleArrayAdd('instructions')} size="sm" variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                      {index + 1}
                    </div>
                    <Textarea
                      value={instruction}
                      onChange={(e) => handleArrayChange('instructions', index, e.target.value)}
                      placeholder="Describe this step..."
                      className="flex-1"
                      rows={2}
                    />
                    {formData.instructions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleArrayRemove('instructions', index)}
                        size="sm"
                        variant="outline"
                        className="mt-1"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tags and Meal Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Tags</h3>
                    <Button type="button" onClick={() => handleArrayAdd('tags')} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        placeholder="e.g., vegetarian"
                        className="flex-1"
                      />
                      {formData.tags.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleArrayRemove('tags', index)}
                          size="sm"
                          variant="outline"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Meal Types</h3>
                    <Button type="button" onClick={() => handleArrayAdd('mealType')} size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.mealType.map((type, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={type}
                        onChange={(e) => handleArrayChange('mealType', index, e.target.value)}
                        placeholder="e.g., breakfast"
                        className="flex-1"
                      />
                      {formData.mealType.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => handleArrayRemove('mealType', index)}
                          size="sm"
                          variant="outline"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {recipe ? 'Update Recipe' : 'Create Recipe'}
              </Button>
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeForm;
