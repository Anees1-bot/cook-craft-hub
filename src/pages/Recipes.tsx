
import { useState, useEffect } from 'react';
import { Search, Plus, ChefHat, Filter } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Card className="w-full max-w-md shadow-custom-lg animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-poppins font-semibold mb-3 text-foreground">Unable to load recipes</h2>
            <p className="text-muted-foreground mb-6 text-pretty">Please check your internet connection and try again.</p>
            <Button onClick={() => refetch()} className="form-button primary">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0 mr-6">
          <div className="sticky top-0 h-screen overflow-y-auto p-6">
            <RecipeSidebar
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
              isOpen={true}
              onToggle={() => {}}
            />
          </div>
        </div>

        {/* Mobile Sidebar */}
        <RecipeSidebar
          selectedTag={selectedTag}
          onTagSelect={handleTagSelect}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sticky Header */}
          <header className="header-sticky">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-poppins font-bold text-foreground mb-2 text-balance">
                    Recipe Collection
                  </h1>
                  <p className="text-muted-foreground text-lg">Discover and create delicious recipes</p>
                </div>
                <Button 
                  onClick={handleCreateRecipe} 
                  size="lg" 
                  className="form-button primary flex items-center gap-2 shadow-custom-md hover:shadow-custom-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Recipe</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="form-input pl-12 h-12 text-base"
                      aria-label="Search recipes"
                    />
                  </div>
                  <Button type="submit" className="form-button primary h-12 px-8">
                    Search
                  </Button>
                </form>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsSidebarOpen(true)}
                    variant="outline"
                    className="lg:hidden form-button secondary h-12"
                    aria-label="Open filters"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  {(searchQuery || selectedTag) && (
                    <Button 
                      onClick={clearFilters} 
                      variant="outline"
                      className="form-button secondary h-12"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Active filters display */}
              {(searchQuery || selectedTag) && (
                <div className="mt-4 flex flex-wrap gap-2 items-center animate-fade-in">
                  <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
                  {searchQuery && (
                    <span className="tag-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      Search: "{searchQuery}"
                    </span>
                  )}
                  {selectedTag && (
                    <span className="tag-badge active">
                      Tag: {selectedTag}
                    </span>
                  )}
                </div>
              )}
            </div>
          </header>

          {/* Content Area */}
          <main className="p-6">
            {/* Loading State */}
            {isLoading && (
              <div className="recipe-grid">
                {[...Array(12)].map((_, i) => (
                  <Card key={i} className="skeleton-shimmer overflow-hidden">
                    <div className="aspect-[4/3] skeleton"></div>
                    <CardContent className="p-5 space-y-3">
                      <div className="h-6 skeleton rounded"></div>
                      <div className="h-4 skeleton rounded w-3/4"></div>
                      <div className="flex gap-2">
                        <div className="h-4 skeleton rounded w-16"></div>
                        <div className="h-4 skeleton rounded w-16"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-6 skeleton rounded w-12"></div>
                        <div className="h-6 skeleton rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recipes Grid */}
            {!isLoading && recipes.length > 0 && (
              <>
                <div className="recipe-grid mb-12">
                  {recipes.map((recipe, index) => (
                    <div 
                      key={recipe.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <RecipeCard
                        recipe={recipe}
                        onClick={() => handleRecipeClick(recipe)}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && !searchQuery && !selectedTag && (
                  <div className="flex justify-center items-center gap-4 py-8">
                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="form-button secondary"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Page</span>
                      <span className="font-semibold text-foreground">{currentPage}</span>
                      <span className="text-sm text-muted-foreground">of {totalPages}</span>
                    </div>
                    
                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="form-button secondary"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!isLoading && recipes.length === 0 && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted/50 flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-poppins font-semibold mb-4 text-foreground">No recipes found</h3>
                <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto text-pretty">
                  {searchQuery || selectedTag
                    ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                    : 'Be the first to add a recipe to our collection!'}
                </p>
                <Button 
                  onClick={handleCreateRecipe}
                  className="form-button primary text-lg px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Recipe
                </Button>
              </div>
            )}
          </main>
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
