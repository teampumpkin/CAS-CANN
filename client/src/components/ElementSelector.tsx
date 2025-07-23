
import React, { useState, useEffect, useCallback } from 'react';
import { X, Edit, Palette, Type, Move, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ElementSelectorProps {
  isActive: boolean;
  onClose: () => void;
}

export const ElementSelector: React.FC<ElementSelectorProps> = ({ isActive, onClose }) => {
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [editingStyles, setEditingStyles] = useState<Record<string, string>>({});
  const [editingText, setEditingText] = useState('');

  const handleMouseOver = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.target as HTMLElement;
    if (target.closest('.element-selector-ui')) return;
    
    setHoveredElement(target);
    target.style.outline = '2px dashed #3b82f6';
    target.style.outlineOffset = '2px';
  }, [isActive]);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.target as HTMLElement;
    if (target.closest('.element-selector-ui')) return;
    
    target.style.outline = '';
    target.style.outlineOffset = '';
  }, [isActive]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!isActive) return;
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.target as HTMLElement;
    if (target.closest('.element-selector-ui')) return;
    
    setSelectedElement(target);
    setEditingText(target.textContent || '');
    
    const computedStyles = window.getComputedStyle(target);
    setEditingStyles({
      color: computedStyles.color,
      backgroundColor: computedStyles.backgroundColor,
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      padding: computedStyles.padding,
      margin: computedStyles.margin,
      borderRadius: computedStyles.borderRadius,
      opacity: computedStyles.opacity,
    });
    
    // Clear hover outline
    if (hoveredElement) {
      hoveredElement.style.outline = '';
      hoveredElement.style.outlineOffset = '';
    }
    
    // Add selection outline
    target.style.outline = '2px solid #ef4444';
    target.style.outlineOffset = '2px';
  }, [isActive, hoveredElement]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('mouseover', handleMouseOver);
      document.addEventListener('mouseout', handleMouseOut);
      document.addEventListener('click', handleClick);
      document.body.style.cursor = 'crosshair';
    } else {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
      document.body.style.cursor = '';
      
      // Clear all outlines
      document.querySelectorAll('[style*="outline"]').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
      document.body.style.cursor = '';
    };
  }, [isActive, handleMouseOver, handleMouseOut, handleClick]);

  const applyStyle = (property: string, value: string) => {
    if (selectedElement) {
      selectedElement.style.setProperty(property, value);
      setEditingStyles(prev => ({ ...prev, [property]: value }));
    }
  };

  const applyText = () => {
    if (selectedElement) {
      selectedElement.textContent = editingText;
    }
  };

  const removeElement = () => {
    if (selectedElement && confirm('Are you sure you want to remove this element?')) {
      selectedElement.remove();
      setSelectedElement(null);
    }
  };

  const getElementInfo = (element: HTMLElement) => {
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ').join('.')}` : '';
    const id = element.id ? `#${element.id}` : '';
    return `${tagName}${id}${className}`;
  };

  if (!isActive) return null;

  return (
    <div className="element-selector-ui fixed inset-0 z-50 pointer-events-none">
      {/* Control Panel */}
      <Card className="fixed top-4 right-4 w-80 max-h-[80vh] overflow-y-auto pointer-events-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Element Editor
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Click any element to select and edit it
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="p-2 bg-muted rounded text-sm font-mono">
                {getElementInfo(selectedElement)}
              </div>
              
              <Tabs defaultValue="styles" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="styles">Styles</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                </TabsList>
                
                <TabsContent value="styles" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Color</label>
                      <Input
                        type="color"
                        value={editingStyles.color || '#000000'}
                        onChange={(e) => applyStyle('color', e.target.value)}
                        className="h-8 p-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Background</label>
                      <Input
                        type="color"
                        value={editingStyles.backgroundColor || '#ffffff'}
                        onChange={(e) => applyStyle('background-color', e.target.value)}
                        className="h-8 p-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Font Size</label>
                    <Select onValueChange={(value) => applyStyle('font-size', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={editingStyles.fontSize} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12px">12px</SelectItem>
                        <SelectItem value="14px">14px</SelectItem>
                        <SelectItem value="16px">16px</SelectItem>
                        <SelectItem value="18px">18px</SelectItem>
                        <SelectItem value="20px">20px</SelectItem>
                        <SelectItem value="24px">24px</SelectItem>
                        <SelectItem value="32px">32px</SelectItem>
                        <SelectItem value="48px">48px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium">Font Weight</label>
                    <Select onValueChange={(value) => applyStyle('font-weight', value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder={editingStyles.fontWeight} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="300">Light</SelectItem>
                        <SelectItem value="400">Normal</SelectItem>
                        <SelectItem value="500">Medium</SelectItem>
                        <SelectItem value="600">Semi Bold</SelectItem>
                        <SelectItem value="700">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Padding</label>
                      <Input
                        placeholder="8px"
                        onChange={(e) => applyStyle('padding', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Margin</label>
                      <Input
                        placeholder="8px"
                        onChange={(e) => applyStyle('margin', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Border Radius</label>
                      <Input
                        placeholder="4px"
                        onChange={(e) => applyStyle('border-radius', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Opacity</label>
                      <Input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={editingStyles.opacity || '1'}
                        onChange={(e) => applyStyle('opacity', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="space-y-3">
                  <div>
                    <label className="text-xs font-medium">Text Content</label>
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      placeholder="Enter text content..."
                      className="h-8"
                    />
                    <Button 
                      size="sm" 
                      onClick={applyText}
                      className="mt-2 w-full h-8"
                    >
                      Apply Text
                    </Button>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={removeElement}
                    className="w-full h-8"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove Element
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Edit className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Select an element to start editing</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 pointer-events-auto">
        <Card className="p-3">
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-dashed border-blue-500"></div>
              <span>Hover to preview</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-red-500"></div>
              <span>Click to select</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
