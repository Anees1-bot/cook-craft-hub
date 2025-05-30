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
        className="fixed top-6 left-6 z-50 lg:hidden form-button primary shadow-custom-lg"
        size="sm"
        aria-label="Open filters"
      >
        <Filter className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        onClick={onToggle}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <Card className="h-full rounded-xl sidebar-glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-card/50">
          <CardTitle className="flex items-center gap-3 font-poppins">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Filter className="w-4 h-4 text-primary" />
            </div>
            Filter by Tags
          </CardTitle>
          <Button
            onClick={onToggle}
            size="sm"
            variant="ghost"
            className="lg:hidden focus-ring"
            aria-label="Close filters"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Clear filter button */}
            {selectedTag && (
              <div>
                <Button
                  onClick={() => onTagSelect(null)}
                  variant="outline"
                  size="sm"
                  className="w-full form-button secondary"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear Filter
                </Button>
                <Separator className="bg-border/50 mt-4" />
              </div>
            )}

            {/* Selected tag */}
            {selectedTag && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium text-muted-foreground mb-3">Active Filter:</p>
                <Badge variant="default" className="text-sm py-1.5 px-3 bg-primary text-primary-foreground max-w-full truncate">
                  {selectedTag}
                </Badge>
              </div>
            )}

            {/* Tags list */}
            <div>
              <p className="text-sm font-medium text-foreground mb-4">Available Tags:</p>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-10 skeleton-shimmer rounded-lg" />
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="space-y-2 pr-2">
                    {tags.map((tag, index) => (
                      <Button
                        key={tag}
                        onClick={() => onTagSelect(tag === selectedTag ? null : tag)}
                        variant={selectedTag === tag ? "default" : "ghost"}
                        size="sm"
                        className={`
                          w-full justify-start text-left h-10 px-4 transition-all duration-200 animate-fade-in min-w-0
                          ${selectedTag === tag 
                            ? 'bg-primary text-primary-foreground shadow-custom-sm' 
                            : 'hover:bg-accent hover:text-accent-foreground interactive-element'
                          }
                        `}
                        style={{ animationDelay: `${index * 20}ms` }}
                      >
                        <span className="truncate flex-1 text-left">{tag}</span>
                        {selectedTag === tag && (
                          <div className="ml-2 w-2 h-2 rounded-full bg-primary-foreground flex-shrink-0" />
                        )}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RecipeSidebar;
