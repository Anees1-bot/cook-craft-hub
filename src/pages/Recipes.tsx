
import { useState, useEffect } from 'react';
import { Search, Plus, ChefHat } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { recipeApi, Recipe, RecipeResponse } from '@/services/recipeApi';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetailModal from '@/components/RecipeDetailModal';
import RecipeForm from '@/components/RecipeForm';
import RecipeSidebar from '@/components/RecipeSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const recipesPerPage = 12;

  // Fetch recipes based on current filters
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recipes', searchQuery, selectedTag, currentPage],
    queryFn: async (): Promise<RecipeResponse> => {
      if (searchQuery.trim()) {
        return recipeApi.searchRecipes(searchQuery);
      } else if (selectedTag) {
        return recipeApi.getRecipesByTag(selectedTag);
      } else {
        const skip = (currentPage - 1) * recipesPerPage;
        return recipeApi.getRecipes(recipesPerPage, skip);
      }
    },
  });

  const recipes = data?.recipes || [];
  const totalRecipes = data?.total || 0;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  // Reset page when search or tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTag]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDetailModalOpen(true);
  };

  const handleCreateRecipe = () => {
    setEditingRecipe(null);
    setIsFormModalOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormModalOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id'> | (Recipe & { id: number })) => {
    try {
      if ('id' in recipeData) {
        // Update existing recipe
        await recipeApi.updateRecipe(recipeData.id, recipeData);
        toast({
          title: "Recipe Updated",
          description: "Your recipe has been successfully updated.",
        });
      } else {
        // Create new recipe
        await recipeApi.createRecipe(recipeData);
        toast({
          title: "Recipe Created",
          description: "Your new recipe has been successfully created.",
        });
      }
      refetch();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast({
        title: "Error",
        description: "There was an error saving your recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    setSearchQuery(''); // Clear search when filtering by tag
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ChefHat className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Unable to load recipes</h2>
            <p className="text-gray-600 mb-4">Please check your internet connection and try again.</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full">
        {/* Sidebar */}
        <div className="hidden lg:block w-80 p-6">
          <RecipeSidebar
            selectedTag={selectedTag}
            onTagSelect={handleTagSelect}
            isOpen={true}
            onToggle={() => {}}
          />
        </div>

        {/* Mobile Sidebar */}
        <RecipeSidebar
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipe Collection</h1>
                <p className="text-gray-600">Discover and create delicious recipes</p>
              </div>
              <Button onClick={handleCreateRecipe} size="lg" className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Recipe
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>

              <div className="flex gap-2">
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  variant="outline"
                  className="lg:hidden"
                >
                  Filter
                </Button>
                {(searchQuery || selectedTag) && (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Active filters display */}
            {(searchQuery || selectedTag) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedTag && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Tag: {selectedTag}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recipes Grid */}
          {!isLoading && recipes.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => handleRecipeClick(recipe)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && !searchQuery && !selectedTag && (
                <div className="flex justify-center gap-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  
                  <span className="flex items-center px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* No Results */}
          {!isLoading && recipes.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedTag
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to add a recipe!'}
              </p>
              <Button onClick={handleCreateRecipe}>Add New Recipe</Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleEditRecipe}
      />

      <RecipeForm
        recipe={editingRecipe}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveRecipe}
      />
    </div>
  );
};

export default Recipes;
