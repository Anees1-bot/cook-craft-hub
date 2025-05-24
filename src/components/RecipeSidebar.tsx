
import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { recipeApi } from '@/services/recipeApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface RecipeSidebarProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const RecipeSidebar = ({ selectedTag, onTagSelect, isOpen, onToggle }: RecipeSidebarProps) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await recipeApi.getTags();
        setTags(fetchedTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden"
        size="sm"
        variant="outline"
      >
        <Filter className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 lg:relative lg:shadow-none lg:bg-transparent">
        <Card className="h-full rounded-none lg:rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Tags
            </CardTitle>
            <Button
              onClick={onToggle}
              size="sm"
              variant="ghost"
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Clear filter button */}
              {selectedTag && (
                <>
                  <Button
                    onClick={() => onTagSelect(null)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Clear Filter
                  </Button>
                  <Separator />
                </>
              )}

              {/* Selected tag */}
              {selectedTag && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Active Filter:</p>
                  <Badge variant="default" className="mb-4">
                    {selectedTag}
                  </Badge>
                </div>
              )}

              {/* Tags list */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Available Tags:</p>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <Button
                          key={tag}
                          onClick={() => onTagSelect(tag === selectedTag ? null : tag)}
                          variant={selectedTag === tag ? "default" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-left"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default RecipeSidebar;
